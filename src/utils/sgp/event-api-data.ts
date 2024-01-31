import {
  SgpCategory,
  SgpEventType,
  SgpGame,
  SgpSessionPracticeDriverResult,
} from 'utils/sgp/types';
import { IsoDate } from 'utils/types';
import { getAccVersionFromTime } from 'utils/acc-version';
import { AccVersion } from 'data/types';
import { sgpGame2Game } from 'data/sgp';
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
  penalties?: SgpEventPointsAdjustments;
}

export type DriverInfo = Pick<
  SgpSessionPracticeDriverResult['participant'],
  'id' | 'name' | 'country' | 'avatarUrl'
> &
  Pick<SgpSessionPracticeDriverResult, 'carModelId'> & {
    category?: SgpSessionPracticeDriverResult['carClassId'];
  };

export class SgpEventApiData {
  private static readonly TYPE = 'SgpEventApiData';
  private session: SgpEventSession;
  private results?: SgpSessionResults;
  private points?: SgpEventPoints;
  private pointsAdjustments?: SgpEventPointsAdjustments;
  private penalties?: SgpEventPointsAdjustments;

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

  public getChampionshipName(): string {
    return this.session.session.tournamentName;
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

  public getAllResults() {
    const indexes: Record<SgpEventType, number> = {
      [SgpEventType.PRACTICE]: 0,
      [SgpEventType.QUALI]: 0,
      [SgpEventType.RACE]: 0,
    };

    if (!this.results) return [];
    return this.results.results.map(
      ({ type }) => this.getResults(type, indexes[type]++)!
    );
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

        // having a lapCount means he joined
        if (result.lapCount) {
          activeDrivers.add(id);
        }
      })
    );

    const all = Array.from(allDrivers.values());
    return type === 'all'
      ? all
      : all.filter(({ id }) => activeDrivers.has(id) === (type === 'active'));
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
    return cat === 'PRO'
      ? SgpCategory.PRO
      : cat === 'SILV' || cat === 'SIL'
      ? SgpCategory.SILVER
      : cat === 'AM'
      ? SgpCategory.AM
      : undefined;
  }
}
