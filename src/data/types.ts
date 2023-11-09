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
  V_2019 = '2019',
  V_2020 = '2020',
  V_2023 = '2023',
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
  raced?: boolean;
  raceNumber?: number;
  category?: Category;
}

export interface Event {
  name: string;
  startTime: Timestamp;
  trackId: TrackData['id'];
  activeDrivers: Driver['id'][];
  inactiveDrivers: Driver['id'][];
}

export interface TrackData {
  id: string;
  name: string;
  game?: Game;
  best: Record<'race' | 'quali', TrackBestData[]>;
}

export interface TrackBestData {
  lapTime: LapTimeAsMs;
  driverId: Driver['id'];
  carId: Car['id'];
  date: Timestamp;
}