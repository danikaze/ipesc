import {
  SgpChampionship,
  SgpChampionshipEntryList,
  SgpChampionshipPoints,
  SgpChampionshipSession,
  SgpEventPointsAdjustments,
} from './types';
import { SgpEventApiData } from './event-api-data';

interface RawData {
  championship: SgpChampionship;
  points: SgpChampionshipPoints;
  sessions: SgpChampionshipSession[];
  penalties: SgpEventPointsAdjustments;
  entryList: SgpChampionshipEntryList;
  events?: SgpEventApiData[];
}

export class SgpChampionshipApiData {
  private static readonly TYPE = 'SgpChampionshipApiData';
  private championship: SgpChampionship;
  private points: SgpChampionshipPoints;
  private sessions: SgpChampionshipSession[];
  private penalties: SgpEventPointsAdjustments;
  private entryList: SgpChampionshipEntryList;
  private events?: SgpEventApiData[];

  constructor(data: RawData) {
    this.championship = data.championship;
    this.points = data.points;
    this.sessions = data.sessions;
    this.penalties = data.penalties;
    this.entryList = data.entryList;
    if (data.events) {
      this.events = data.events;
    }
  }

  public static fromJson(data: unknown): SgpChampionshipApiData {
    const json = typeof data === 'string' ? JSON.parse(data) : data;
    if (json._type !== SgpChampionshipApiData.TYPE) {
      throw new Error(`Wrong type "${json._type}" when parsing SgpChampionshipApiData`);
    }
    return new SgpChampionshipApiData({
      ...json,
      events: json.events?.map((ev: unknown) =>
        ev instanceof SgpEventApiData ? ev : SgpEventApiData.fromJson(ev)
      ),
    });
  }

  public toJson(): string {
    const data = {
      _type: SgpChampionshipApiData.TYPE,
      championshipData: this.championship,
      points: this.points,
      sessions: this.sessions,
      penalties: this.penalties,
      entryList: this.entryList,
    };
    if (this.events) {
      (data as any).events = this.events.map((ev) => JSON.parse(ev.toJson()));
    }
    return JSON.stringify(data);
  }

  public getDriverNumber(driverId: string): number | undefined {
    return this.entryList.entries.find((entry) => driverId === entry.driverId)
      ?.raceNumber;
  }
}
