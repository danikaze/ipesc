import { Timestamp } from 'utils/types';

export interface ProcessedData {
  processedOn: Timestamp;
  drivers: Driver[];
  cars: Car[];
  championships: Championship[];
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
  drivers: {
    id: Driver['id'];
    carId: Car['id'];
    raced?: boolean;
    raceNumber?: number;
    category?: Category;
  }[];
  events: Event[];
}

export interface Event {
  name: string;
  startTime: Timestamp;
  activeDrivers: Driver['id'][];
  inactiveDrivers: Driver['id'][];
}
