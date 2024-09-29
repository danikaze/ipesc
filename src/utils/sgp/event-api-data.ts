import { sgpGame2Game } from 'data/sgp';
import { AccVersion } from 'data/types';
import { getAccVersionFromTime } from 'utils/acc-version';
import {
  SgpCategory,
  SgpEventPenalties,
  SgpEventType,
  SgpGame,
  SgpPenalty,
  SgpPointsAdjustment,
  SgpSessionPracticeDriverResult,
  SgpSessionQualifyDriverResult,
  SgpSessionRaceDriverResult,
} from 'utils/sgp/types';
import { IsoDate } from 'utils/types';
import {
  SgpEventPoints,
  SgpEventPointsAdjustments,
  SgpEventSession,
  SgpSessionResults,
} from './types';

interface RawData {
  session: SgpEventSession;
  results?: SgpSessionResults;
  points?: SgpEventPoints;
  pointsAdjustments?: SgpEventPointsAdjustments;
  penalties?: SgpEventPenalties;
}

export type DriverInfo = Pick<
  SgpSessionPracticeDriverResult['participant'],
  'id' | 'name' | 'country' | 'avatarUrl'
> &
  Pick<SgpSessionPracticeDriverResult, 'carModelId'> & {
    category?: SgpSessionPracticeDriverResult['carClassId'];
  };

export interface SgpPenaltyData extends SgpPenalty {
  raceIndex: number;
  driverId: DriverInfo['id'];
}

export interface SgpPointAdjustmentData extends SgpPointsAdjustment {
  raceIndex: number;
  driverId: DriverInfo['id'];
  scope: 'CLASS';
}

export class SgpEventApiData {
  private static readonly TYPE = 'SgpEventApiData';
  private session: SgpEventSession;
  private results?: SgpSessionResults;
  private points?: SgpEventPoints;
  private pointsAdjustments?: SgpEventPointsAdjustments;
  private penalties?: SgpEventPenalties;

  constructor(data: RawData) {
    this.session = data.session;
    this.results = data.results;
    this.points = data.points;
    this.pointsAdjustments = data.pointsAdjustments;
    this.penalties = data.penalties;
  }

  public static fromJson(data: unknown): SgpEventApiData {
    const json = typeof data === 'string' ? JSON.parse(data) : data;
    if (json._type !== SgpEventApiData.TYPE) {
      throw new Error(`Wrong type "${json._type}" when parsing SgpEventApiData`);
    }
    return new SgpEventApiData(json);
  }

  public toJson(): string {
    return JSON.stringify({
      _type: SgpEventApiData.TYPE,
      session: this.session,
      results: this.results,
      points: this.points,
      pointsAdjustments: this.pointsAdjustments,
      penalties: this.penalties,
    });
  }

  public isFinished(): boolean {
    return this.results !== undefined;
  }

  public getSessionId(): string {
    return this.session.session.id;
  }

  public getChampionshipId(): string {
    return this.session.session.tournamentId;
  }

  public getChampionshipName(): string {
    return this.session.session.tournamentName;
  }

  public getLeagueId(): string {
    return this.session.session.leagueId;
  }

  public getEventName(): string {
    return this.session.session.sessionName;
  }

  public getGame(): SgpGame {
    return this.session.session.game;
  }

  public getAccVersion(): AccVersion | undefined {
    return getAccVersionFromTime(
      sgpGame2Game(this.session.session.game),
      new Date(this.getStartDate()).getTime()
    );
  }

  public getTrackId() {
    return this.session.session.trackId;
  }

  public getTrackName() {
    return this.session.session.trackName;
  }

  public getStartDate(): IsoDate {
    return this.session.session.startsAt;
  }

  public getNumberOfRaces(): number | undefined {
    return this.results?.results.filter((obj) => obj.type === SgpEventType.RACE).length;
  }

  public getCategoryList(): undefined | SgpCategory[] {
    const cats = this.session.session.carClasses?.map(
      ({ id }) => SgpEventApiData.toCategory(id)!
    );
    return cats?.length > 0 ? cats : undefined;
  }

  public getAllPenalties(): SgpPenaltyData[] {
    const res: SgpPenaltyData[] = [];
    if (!this.penalties) return res;

    this.penalties.forEach((race, raceIndex) => {
      Object.entries(race).forEach(([driverId, penalties]) => {
        penalties.forEach((penalty) => {
          res.push({
            raceIndex,
            driverId,
            ...penalty,
          });
        });
      });
    });

    return res;
  }

  public getAllPointsAdjustments(): SgpPointAdjustmentData[] {
    const res: SgpPointAdjustmentData[] = [];
    if (!this.pointsAdjustments) return res;

    this.pointsAdjustments.forEach((race, raceIndex) => {
      Object.entries(race).forEach(([driverId, adjustments]) => {
        adjustments.forEach((data) => {
          res.push({
            raceIndex,
            driverId,
            ...data,
          });
        });
      });
    });

    return res;
  }

  /**
   * Get a list of driver results for the given event and index
   * (in case of multiple races)
   * Ordered by their position by default
   */
  public getResults(type: SgpEventType, raceIndex: number = 0) {
    const session = this.results?.results.filter((obj) => obj.type === type)[raceIndex];
    if (!session) return;

    const res = {
      ...session,
      results: session.results.map((entry) => {
        const points = this.getRacePoints(entry.driverId, raceIndex);
        const pointsAdjustments = this.getPointsAdjustmentsTotal(
          entry.driverId,
          raceIndex
        );
        const car = this.getCar(entry.carModelId);

        return {
          ...entry,
          points,
          pointsAdjustment: pointsAdjustments,
          pointsTotal:
            isNaN(points!) || isNaN(pointsAdjustments)
              ? undefined
              : points! + pointsAdjustments,
          penalties: this.getPenaltiesTotal(entry.driverId, raceIndex),
          carName: car?.name,
          category: SgpEventApiData.toCategory(entry.carClassId),
        };
      }),
    };
    res.results.sort((a, b) => (a.position || Infinity) - (b.position || Infinity));
    return res;
  }

  public getResultsByCategory(): Record<
    SgpCategory,
    | SgpSessionPracticeDriverResult[]
    | SgpSessionQualifyDriverResult[]
    | SgpSessionRaceDriverResult[]
  >[];
  public getResultsByCategory(
    type: SgpEventType.PRACTICE
  ): Record<SgpCategory, SgpSessionPracticeDriverResult[]>[];
  public getResultsByCategory(
    type?: SgpEventType.QUALI
  ): Record<SgpCategory, SgpSessionQualifyDriverResult[]>[];
  public getResultsByCategory(
    type?: SgpEventType.RACE
  ): Record<SgpCategory, SgpSessionRaceDriverResult[]>[];
  public getResultsByCategory(type?: SgpEventType) {
    const results = this.getAllResults(type);
    return results.map((race) => {
      const res: Record<
        SgpCategory,
        | SgpSessionPracticeDriverResult[]
        | SgpSessionQualifyDriverResult[]
        | SgpSessionRaceDriverResult[]
      > = {
        [SgpCategory.NONE]: [],
        [SgpCategory.PRO]: [],
        [SgpCategory.SILVER]: [],
        [SgpCategory.AM]: [],
      };

      for (const r of race.results) {
        // only active drivers are included
        if (r.carId === '-1') continue;
        const cat = SgpEventApiData.toCategory(r.carClassId) || SgpCategory.NONE;
        res[cat].push(r as any);
      }

      return res;
    });
  }

  public getAllResults(type?: SgpEventType) {
    const indexes: Record<SgpEventType, number> = {
      [SgpEventType.PRACTICE]: 0,
      [SgpEventType.QUALI]: 0,
      [SgpEventType.RACE]: 0,
    };

    if (!this.results) return [];
    return this.results.results
      .map(({ type }) => this.getResults(type, indexes[type]++)!)
      .filter((result) => !type || result.type === type);
  }

  public getCar(id: string) {
    return this.session.session.cars.find((car) => car.id === id);
  }

  /**
   * Calculate the entry list based on the drivers that have joined any session
   * of this event.
   * 'active' will return only the ones that joined any of the sessions
   * 'inactive' will return those who didn't join any
   * 'all' will return both
   */
  public getDrivers(type: 'active' | 'inactive' | 'all'): DriverInfo[] {
    const allDrivers = new Map<DriverInfo['id'], DriverInfo>();
    const activeDrivers = new Set<DriverInfo['id']>();
    this.results?.results.forEach((session) =>
      session.results.forEach((result) => {
        // add the information of the driver
        const id = result.participant.id;
        allDrivers.set(id, {
          ...allDrivers.get(id),
          id,
          name: result.participant.name,
          country: result.participant.country,
          avatarUrl: result.participant.avatarUrl,
          carModelId: result.carModelId,
          category: result.carClassId,
        });

        // having a lap done means he joined the event
        if (result.lapCount > 0) {
          activeDrivers.add(id);
        }
      })
    );

    const all = Array.from(allDrivers.values());
    return type === 'all'
      ? all
      : all.filter(({ id }) => activeDrivers.has(id) === (type === 'active'));
  }

  /**
   * Get the points assigned per position, without calling any other API, from the data
   * of the races
   */
  public getPointSystem(): number[] {
    if (!this.points) return [];

    const races = this.getResultsByCategory(SgpEventType.RACE);
    const points: number[] = [];

    for (let r = 0; r < races.length; r++) {
      const race = races[r];
      const racePoints = this.points.racePoints[r];
      Object.values(race).forEach((results) => {
        for (let i = 0; i < results.length; i++) {
          const res = results[i];
          if (res.carId === '-1') continue;
          points[i] = racePoints[res.driverId].points;
        }
      });
    }

    return points;
  }

  private getRacePoints(driverId: string, raceIndex: number): number | undefined {
    try {
      return this.points?.racePoints[raceIndex][driverId].points;
    } catch {}
  }

  private getPointsAdjustmentsTotal(driverId: string, index: number): number {
    const adjustments = this.pointsAdjustments?.[index]?.[driverId];
    if (!adjustments) return 0;
    return adjustments.reduce((total, item) => total + item.points, 0);
  }

  private getPenaltiesTotal(driverId: string, raceIndex: number): number {
    return this.penalties?.[raceIndex]?.[driverId]?.length ?? 0;
  }

  private static toCategory(data: string | undefined): SgpCategory | undefined {
    const cat = data?.toUpperCase();
    if (!cat) return;

    return cat.startsWith('PRO')
      ? SgpCategory.PRO
      : cat.startsWith('SIL')
      ? SgpCategory.SILVER
      : cat.startsWith('AM')
      ? SgpCategory.AM
      : undefined;
  }
}
