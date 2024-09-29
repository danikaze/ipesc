import {
  DriverInfo,
  SgpPointAdjustmentData,
  SgpEventApiData,
  SgpPenaltyData,
} from 'utils/sgp/event-api-data';
import { SgpCategory, SgpEventType, SgpSessionRaceDriverResult } from 'utils/sgp/types';
import { FASTEST_LAP_POINTS, PenaltyQuerier } from './definition';
import { getSrgpActionText } from './get-srgp-action-text';
import {
  ActionState,
  AddPenaltyAdjustment,
  type ActionData,
  type PenaltyData,
} from './penalty-dialog';

interface PenaltyResults {
  // results sorted after penalties applied
  results: Record<SgpCategory, SgpSessionRaceDriverResult[]>[];
  // penalty points to apply per driver, per race
  pp: Record<DriverInfo['id'], number>[];
}

export function calculateActions(
  eventData: SgpEventApiData | undefined,
  penalties: PenaltyData[],
  getPenalty: PenaltyQuerier | undefined
): ActionData[] {
  if (!eventData || !getPenalty) return [];

  const penaltyResults = applyPenalties(eventData, penalties, getPenalty);
  const actions = getActions(eventData, penaltyResults);

  return actions;
}

function applyPenalties(
  eventData: SgpEventApiData,
  penalties: PenaltyData[],
  getPenalty: PenaltyQuerier
): PenaltyResults {
  const res: PenaltyResults = {
    results: eventData.getResultsByCategory(SgpEventType.RACE),
    pp: [],
  };

  // apply penalties
  for (const penalty of penalties) {
    const race = res.results[penalty.raceIndex];
    const driverResult = findResultInCategories(race, penalty.driver);
    const p = getPenalty(penalty.tier, penalty.mult);
    if (!driverResult || !driverResult.totalTime || !p) continue;
    driverResult.totalTime += p.secs * 1000;

    if (!res.pp[penalty.raceIndex]) {
      res.pp[penalty.raceIndex] = {};
    }
    res.pp[penalty.raceIndex][penalty.driver.id] =
      (res.pp[penalty.raceIndex][penalty.driver.id] || 0) + p.points;
  }

  // reorder results for each race based on the new total time after penalties
  for (const byCat of res.results) {
    Object.values(byCat).forEach((results) => {
      results.sort((a, b) => b.lapCount - a.lapCount || a.totalTime - b.totalTime);
    });
  }

  return res;
}

function getActions(eventData: SgpEventApiData, penalty: PenaltyResults): ActionData[] {
  const actions: ActionData[] = [];
  const originalResults = eventData.getResultsByCategory(SgpEventType.RACE);
  const penaltyResults = penalty.results;
  const pointsPerPosition = eventData.getPointSystem();
  const drivers = eventData.getDrivers('active');

  // add actions for fastest laps
  for (let raceIndex = 0; raceIndex < originalResults.length; raceIndex++) {
    Object.values(originalResults[raceIndex]).forEach((results) => {
      // skip the empty categories
      if (!results.length) return;
      const driverId = getFastestLapDriverId(results);
      const driver = drivers.find((driver) => driver.id === driverId)!;
      const action = addActionState(eventData, {
        type: 'FASTEST_LAP',
        raceIndex,
        driver,
        points: FASTEST_LAP_POINTS,
      });
      actions.push(action);
    });
  }

  // add actions for penalty points
  for (let raceIndex = 0; raceIndex < penalty.pp.length; raceIndex++) {
    const pp = penalty.pp[raceIndex];
    Object.entries(pp).forEach(([driverId, points]) => {
      const driver = drivers.find((driver) => driver.id === driverId)!;
      actions.push(
        addActionState(eventData, {
          type: 'PP',
          raceIndex,
          points,
          driver,
        })
      );
    });
  }

  // get diff
  for (let raceIndex = 0; raceIndex < originalResults.length; raceIndex++) {
    const allResultsBefore = Object.entries(originalResults[raceIndex]) as [
      SgpCategory,
      SgpSessionRaceDriverResult[],
    ][];
    const resultsByCatAfter = penaltyResults[raceIndex];

    for (const [cat, resultsBefore] of allResultsBefore) {
      const resultsAfter = resultsByCatAfter[cat];

      for (let i = 0; i < resultsBefore.length; i++) {
        const before = resultsBefore[i];
        if (!before.lapCount) continue;

        const driver = drivers.find((driver) => driver.id === before.driverId)!;

        // see the new position
        const iAfter = resultsAfter.findIndex((res) => res.driverId === driver.id);

        // no changes on the final position
        if (iAfter === i) continue;

        const after = resultsAfter[iAfter];
        const pointsBefore = pointsPerPosition[i];
        const pointsAfter = pointsPerPosition[iAfter];
        const oldPos = i + 1;
        const newPos = iAfter + 1;

        actions.push(
          addActionState(eventData, {
            type: 'PENALTY',
            raceIndex,
            driver,
            points: pointsAfter - pointsBefore,
            oldTime: before.totalTime,
            newTime: after.totalTime,
            oldPos,
            newPos,
          } as AddPenaltyAdjustment)
        );
      }
    }
  }

  return actions;
}

function findResultInCategories(
  results: Record<SgpCategory, SgpSessionRaceDriverResult[]>,
  driver: DriverInfo
): SgpSessionRaceDriverResult | undefined {
  const resultsByCat = Object.values(results);
  for (const result of resultsByCat) {
    const r = result.find((res) => res.driverId === driver.id);
    if (r) return r;
  }
}

function getFastestLapDriverId(results: SgpSessionRaceDriverResult[]): DriverInfo['id'] {
  let fastestTime = Infinity;
  let fastestDriver = results[0].driverId;

  for (const res of results) {
    if (!res.bestCleanLapTime) continue;
    if (res.bestCleanLapTime < fastestTime) {
      fastestTime = res.bestCleanLapTime;
      fastestDriver = res.driverId;
    }
  }

  return fastestDriver;
}

export function addActionState(
  eventData: SgpEventApiData,
  action: Omit<ActionData, 'reason' | 'state'>
): ActionData {
  const state = actionExists(eventData, { ...action })
    ? ActionState.ALREADY
    : ActionState.WAITING;
  return Object.assign(action, { state }) as ActionData;
}

function actionExists(
  eventData: SgpEventApiData,
  action: Pick<ActionData, 'type' | 'raceIndex' | 'driver' | 'points'>
): boolean {
  const list =
    action.type === 'PP'
      ? eventData.getAllPenalties()
      : eventData.getAllPointsAdjustments();
  if (!list) return false;

  const getFilter =
    (reason: string) =>
    (data: SgpPenaltyData | SgpPointAdjustmentData): boolean =>
      data.raceIndex === action.raceIndex &&
      data.driverId === action.driver.id &&
      data.points === action.points &&
      data.reason === reason;

  const doneActions = list.filter(getFilter(getSrgpActionText({ action })));
  const undoneActions = list.filter(getFilter(getSrgpActionText({ action, undo: true })));

  return doneActions.length > undoneActions.length;
}
