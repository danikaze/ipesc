import {
  SgpCategory,
  SgpEventType,
  SgpSessionPracticeDriverResult,
} from 'utils/sgp/types';
import {
  SgpEventPoints,
  SgpEventPointsAdjustments,
  SgpEventSession,
  SgpSessionResults,
} from './types';

interface RawData {
  session: SgpEventSession;
  results: SgpSessionResults;
  points: SgpEventPoints;
  pointsAdjustments: SgpEventPointsAdjustments;
  penalties: SgpEventPointsAdjustments;
}

export type DriverInfo = Pick<
  SgpSessionPracticeDriverResult['participant'],
  'id' | 'name' | 'country' | 'avatarUrl'
> & {
  carModelId: SgpSessionPracticeDriverResult['carModelId'];
  category?: SgpSessionPracticeDriverResult['carClassId'];
};

export class SgpEventApiData {
  private static readonly TYPE = 'SgpEventApiData';
  private session: SgpEventSession;
  private results: SgpSessionResults;
  private points: SgpEventPoints;
  private pointsAdjustments: SgpEventPointsAdjustments;
  private penalties: SgpEventPointsAdjustments;

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

  public getChampionshipName() {
    return this.session.session.tournamentName;
  }

  public getEventName() {
    return this.session.session.sessionName;
  }

  public getNumberOfRaces(): number {
    return this.results.results.filter((obj) => obj.type === SgpEventType.RACE).length;
  }

  public getCategoryList(): undefined | SgpCategory[] {
    const cats = this.session.session.carClasses?.map(({ id }) => id);
    return cats?.length > 0 ? cats : undefined;
  }

  /**
   * Get a list of driver results for the given event and index
   * (in case of multiple races)
   * Ordered by their position by default
   */
  public getResults(type: SgpEventType, raceIndex: number = 0) {
    const session = this.results.results.filter((obj) => obj.type === type)[raceIndex];
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

  public getCar(id: string) {
    return this.session.session.cars.find((car) => car.id === id);
  }

  /**
   * Calculate the entry list based on the drivers that have joined any session
   * of this event (not including those inscribed on the championship but not
   * participating in this event)
   */
  public getDrivers(): DriverInfo[] {
    const map = new Map<string, DriverInfo>();
    this.results.results.forEach((session) =>
      session.results.forEach((result) => {
        // no need to add drivers already added
        if (map.has(result.driverId)) return;
        // no totalTime means it didn't join
        if (!result.totalTime) return;

        const info: DriverInfo = {
          id: result.participant.id,
          name: result.participant.name,
          country: result.participant.country,
          avatarUrl: result.participant.avatarUrl,
          carModelId: result.carModelId,
        };
        if (result.carClassId) {
          info.category = result.carClassId;
        }
        map.set(result.driverId, info);
      })
    );
    return Array.from(map.values());
  }

  private getRacePoints(driverId: string, raceIndex: number): number | undefined {
    try {
      return this.points.racePoints[raceIndex][driverId].points;
    } catch {}
  }

  private getPointsAdjustmentsTotal(driverId: string, index: number): number {
    const adjustments = this.pointsAdjustments[index]?.[driverId];
    if (!adjustments) return 0;
    return adjustments.reduce((total, item) => total + item.points, 0);
  }

  private getPenaltiesTotal(driverId: string, raceIndex: number): number {
    return this.penalties[raceIndex]?.[driverId]?.length ?? 0;
  }

  private static toCategory(data: string): SgpCategory | undefined {
    const cat = data?.toUpperCase();
    return cat === 'PRO'
      ? SgpCategory.PRO
      : cat === 'SIL'
      ? SgpCategory.SILVER
      : cat === 'AM'
      ? SgpCategory.AM
      : undefined;
  }
}
