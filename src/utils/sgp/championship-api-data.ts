import {
  SgpChampionship,
  SgpChampionshipEntryList,
  SgpChampionshipPoints,
  SgpChampionshipSession,
  SgpEventPointsAdjustments,
  SgpGame,
} from './types';
import { SgpEventApiData } from './event-api-data';
import { IsoDate } from 'utils/types';

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
      championship: this.championship,
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

  public getId(): string {
    return this.championship.id;
  }

  public getGame(): SgpGame {
    return this.championship.state.gameSettings.game;
  }

  public getName(): string {
    return this.championship.state.name;
  }

  public getStartDate(): IsoDate {
    return this.championship.state.startDate;
  }

  public getDrivers() {
    return this.entryList.entries.map((entry) => ({
      id: entry.driverId,
      name: entry.participant.driverName,
      country: entry.participant.country,
      carId: entry.car.model,
      category: entry.car.carClassId,
      raceNumber: entry.raceNumber,
    }));
  }

  public getCars() {
    return this.entryList.entries.map((entry) => ({
      id: entry.car.model,
      name: this.getCarName(entry.car.model),
    }));
  }

  public getDriverNumber(driverId: string): number | undefined {
    return this.entryList.entries.find((entry) => driverId === entry.driverId)
      ?.raceNumber;
  }

  public getCarName(carId: string): string | undefined {
    return this.championship.state.gameSettings.cars.find((car) => car.id === carId)
      ?.name;
  }

  public getEvents(): SgpEventApiData[] {
    return this.events || [];
  }
}
