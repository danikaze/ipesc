import { SgpCategory, SgpEventType } from 'utils/sgp/types';
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
    return this.session.session.carClasses?.map(({ id }) => id);
  }

  public getResults(type: SgpEventType, index: number = 0) {
    const session = this.results.results.filter((obj) => obj.type === type)[index];
    return {
      ...session,
      results: session.results.map((entry) => {
        const points = this.getRacePoints(entry.driverId, index);
        const pointsAdjustments = this.getPointsAdjustmentsTotal(entry.driverId, index);
        const car = this.getCar(entry.carModelId);

        return {
          ...entry,
          points,
          pointsAdjustment: pointsAdjustments,
          pointsTotal:
            isNaN(points!) || isNaN(pointsAdjustments)
              ? undefined
              : points! + pointsAdjustments,
          penalties: this.getPenaltiesTotal(entry.driverId, index),
          carName: car?.name,
          category: SgpEventApiData.toCategory(entry.carClassId),
        };
      }),
    };
  }

  public getCar(id: string) {
    return this.session.session.cars.find((car) => car.id === id);
  }

  private getRacePoints(driverId: string, index: number): number | undefined {
    try {
      return this.points.racePoints[index][driverId].points;
    } catch {}
  }

  private getPointsAdjustmentsTotal(driverId: string, index: number): number {
    const adjustments = this.pointsAdjustments[index]?.[driverId];
    if (!adjustments) return 0;
    return adjustments.reduce((total, item) => total + item.points, 0);
  }

  private getPenaltiesTotal(driverId: string, index: number): number {
    return this.penalties[index]?.[driverId]?.length ?? 0;
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
