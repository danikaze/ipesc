import { IsoDate, NumberAsString } from 'utils/types';

export type AccResultsCarClass = 'GT3' | 'GT4';

export type AccResultsTrackStatus = 'OPTIMUM';

export type AccResultsTyreName = 'DHE' | 'WH';

export type AccResultsCar =
  | string
  | 'AMR V8 Vantage GT3'
  | 'Ford Mustang GT3'
  | 'McLaren 720S GT3 EVO'
  | 'Ferrari 296 GT3'
  | 'BMW M4 GT3'
  | 'Lamborghini Huracan GT3 EVO2'
  | 'Porsche 992 GT3 R'
  | 'Audi R8 LMS EVO II'
  | 'Bentley Continental GT3 (2018)'
  | 'Nissan GT-R Nismo GT3 (2018)';

export interface AccResultsJson {
  sessionId: string;
  seasonId: string;
  sessionDateTime: string;
  track: string;
  dateHour: number;
  dateMinute: number;
  raceDay: number;
  timeMultiplier: number;
  sessionDuration: number;
  round: number;
  sessionType: number;
  isWetSession: number;
  typeId: number;
  car: string;
  manuallyAdded: number;
  eventOnlineReference: number;
  totalTime: number;
  lapCount: number;
  sessionPosition: number;
  ambientTemperature: number;
  roadTemperature: number;
  windSpeed: number;
  windDirection: number;
  cloudLevel: number;
  rainLevel: number;
  isDynamic: number;
  ambientTemperatureMean: number;
  windSpeedMean: number;
  windSpeedDeviation: number;
  windHarmonic: number;
  nHarmonics: number;
  weatherBaseMean: number;
  weatherBaseDeviation: number;
  idealLineGrip: number;
  outsideLineGrip: number;
  marblesLevel: number;
  puddlesLevel: number;
  wetDryLineLevel: number;
  wetLevel: number;
  playerRaceNumber: number;
  points1: number;
  points2: number;
  points3: number;
  points4: number;
  points5: number;
  isOnline: number;
  recordedBy: 'UDP';
  playerEcuMode: number;
  maxSpeed: number;
  peakAcceleration: number;
  fuelPerLap: number;
  averageLapTime: number;
  positionStartSession: number;
  positionDelta: number;
  notes: string;
  dryTyreName: string;
  wetTyreName: string;
  replayStartTime: IsoDate;
  preSessionTime: IsoDate;
  penaltyTime: number;
  strengthOfField: number;
  raceId: number;
  raceSplit: number;
  postRaceUpdate: boolean;
  hasTelemetry: boolean;
  laps: AccResultsLap[];
  accidents: AccResultsAccident[];
}

export interface AccResultsLap {
  track: string;
  sector4: number;
  timestamp: NumberAsString;
  flags: number;
  deltaToRaceRecord: number;
  deltaToQualyRecord: number;
  deltaToRaceSlowest: number;
  deltaToQualySlowest: number;
  deltaToLapRecord: number;
  timingFlags: number;
  position: number;
  penalty: number;
  team: number;
  playerName: NumberAsString;
  driver: string;
  driverFirstName: string;
  driverLastName: string;
  driverNickName: string;
  driverMoniker: string;
  driverPlayerId: string;
  driverId: number;
  playerUnclear: boolean;
  playerRank: number;
  gapTime: number;
  peakAccelTime: number;
  peakAccelDist: number;
  accelZoneMinSpeed: number;
  accelZoneMaxSpeed: number;
  peakAcceleration: number;
  damageFront: number;
  damageRear: number;
  damageCentre: number;
  damageLeft: number;
  damageRight: number;
  nationality: number;
  cupCategory: number;
  isOnline: number;
  eventOnlineReference: number;
  accidents: number;
  realTimeStamp: number;
  adjustedTimeStamp: number;
  lapCompletedTimestamp: number;
  lapZeroTimestamp: number;
  broadcastPosition: number;
  positionStartLap: number;
  fuelStartLap: number;
  positionDelta: number;
  carClass: AccResultsCarClass;
  startingPosition: number;
  quarterwayPosition: number;
  halfwayPosition: number;
  tyreSet: number;
  suspensionDamageFL: number;
  suspensionDamageFR: number;
  suspensionDamageRL: number;
  suspensionDamageRR: number;
  penaltyTime: number;
  disqualified: number;
  safetyRatingInitial: number;
  safetyRatingFinal: number;
  safetyRatingGain: number;
  eloInitial: number;
  eloFinal: number;
  eloGain: number;
  licenceInitial: NumberAsString | '';
  licenceFinal: NumberAsString | '';
  pitTime: number;
  invalidLapCleared: boolean;
  sessionId: string;
  carId: number;
  raceNumber: number;
  driverCategory: number;
  lapTime: number;
  sector1: number;
  sector2: number;
  sector3: number;
  fuel: number;
  sessionType: number;
  isWetSession: number;
  status: AccResultsTrackStatus;
  ecuMode: number;
  windSpeed: number;
  windDirection: number;
  sessionChangeStatus: number;
  manuallyAdded: boolean;
  maxSpeed: number;
  brakeBias: number;
  tyreName: string;
  trackGripStatus: number;
  rainIntensity: number;
  airTemp: number;
  roadTemp: number;
  lapType: number;
  lapNumber: number;
  car: string;
  rainTyres: number;
  tyrePressureFL: number;
  tyrePressureFR: number;
  tyrePressureRL: number;
  tyrePressureRR: number;
  tyreTempFL: number;
  tyreTempFR: number;
  tyreTempRL: number;
  tyreTempRR: number;
  brakeTempFL: number;
  brakeTempFR: number;
  brakeTempRL: number;
  brakeTempRR: number;
  brakeCompoundF: number;
  brakeCompoundR: number;
}

export interface AccResultsAccident {}
