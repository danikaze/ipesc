import { LapTimeAsMs, Timestamp } from 'utils/types';

export interface ProcessedData {
  processedOn: Timestamp;
  drivers: Driver[];
  cars: Car[];
  championships: Championship[];
  tracks: TrackData[];
}

export const enum Category {
  PRO = 'P',
  SILVER = 'S',
  AM = 'A',
}

export const enum Game {
  ACC = 'ACC',
  AC = 'AC',
  RACE_ROOM = 'R3E',
  AUTOMOBILISTA_2 = 'AMS2',
  F1_23 = 'F1-23',
}

export const enum AccVersion {
  PRE_V_16 = 'pre-1.6',
  V_16 = '1.6',
  V_18 = '1.8',
  V_19 = '1.9',
}

export interface Driver {
  id: string;
  name: string;
  country?: string;
}

export interface Car {
  id: string;
  name: string;
}

export interface Championship {
  id: string;
  game?: Game;
  name: string;
  customName?: string;
  startTime: Timestamp;
  drivers: ChampionshipDriver[];
  events: Event[];
}

export interface ChampionshipDriver {
  id: Driver['id'];
  carId: Car['id'];
  raceNumber?: number;
  category?: Category;
}

export type EventType = 'quali' | 'race';

export interface Event {
  name: string;
  startTime: Timestamp;
  trackId: TrackData['id'];
  inactiveDrivers: Driver['id'][];
  results: {
    type: EventType;
    wet?: boolean;
    results: EventResult[];
  }[];
}

export interface EventResult {
  driverId: Driver['id'];
  carId: Car['id'];
  bestCleanLapTime?: LapTimeAsMs;
  avgCleanLapTime?: LapTimeAsMs;
  averageLapTime?: LapTimeAsMs;
  position?: number;
  retired?: boolean;
}

export interface TrackData {
  id: string;
  name: string;
  game?: Game;
  version?: AccVersion;
  best: Partial<Record<EventType | 'raceAvg', TrackRecord>>;
}

export interface TrackRecord {
  lapTime: LapTimeAsMs;
  driverId: Driver['id'];
  carId: Car['id'];
  date: Timestamp;
}
