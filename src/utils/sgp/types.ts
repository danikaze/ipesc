import { BooleanInt, IsoDate, LapTimeAsMs, NumberAsString } from 'utils/types';

export enum SgpEventType {
  PRACTICE = 'PRACTICE',
  QUALI = 'QUALIFY',
  RACE = 'RACE',
}

export enum SgpCategory {
  PRO = 'PRO',
  SILVER = 'SIL',
  AM = 'AM',
}

export enum SgpGame {
  ACC = 'acc',
  AC = 'assetto_corsa',
  RACE_ROOM = 'r3e',
  AUTOMOBILISTA_2 = 'ams2',
  F1_23 = 'f1-23',
}

export enum SgpTournamentType {
  CHAMPIONSHIP = 'CHAMPIONSHIP',
}

export interface SgpCar {
  id: NumberAsString;
  name: string;
  category: SgpCategory;
}

export interface SgpCarModel {
  id: NumberAsString;
  name: string;
  carClassId: SgpCategory;
}

export interface SgpCarClass {
  id: SgpCategory;
  name: string;
  driverCategory: SgpDriverCategory;
}

export enum SgpDriverCategory {
  PRO = 3,
  SILVER = 2,
  AM = 1,
}

export enum SgpFlowStatus {
  DRAFT = 'DRAFT',
  WAITING = 'WAITING',
  STARTED = 'STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ENDED = 'ENDED',
}

export interface SgpStatusHistory {
  status: SgpFlowStatus;
  invokedBy: string;
  timestamp: IsoDate;
}

export interface SgpConfigPart {
  hourOfDay: number;
  sessionType: 'P' | 'Q' | 'R';
  dayOfWeekend: number;
  timeMultiplier: number;
  sessionDurationMinutes: number;
}

export interface SgpEventSession {
  session: {
    id: string;
    startsAt: IsoDate;
    game: SgpGame;
    leagueId: string;
    tournamentId: string;
    duration: number;
    config: {
      parts: SgpConfigPart[];
      rules: {
        eventRules: {
          tyreSetCount: number;
          superpoleMaxCar: number;
          pitWindowLengthSec: number;
          qualifyStandingType: number;
          isRefuellingTimeFixed: boolean;
          mandatoryPitstopCount: number;
          isRefuellingAllowedInRace: boolean;
          isMandatoryPitstopRefuellingRequired: boolean;
          isMandatoryPitstopTyreChangeRequired: boolean;
        };
        eventConfig: {
          metaData: string;
          postRaceSeconds: number;
          postQualySeconds: number;
          sessionOverTimeSeconds: number;
          preRaceWaitingTimeSeconds: number;
        };
      };
      isRanked: boolean;
      location: string;
      settings: {
        allowAutoDQ: BooleanInt;
        formationLapType: number;
        shortFormationLap: BooleanInt;
      };
      passwords: {
        admin: null | string;
        server: null | string;
        spectator: null | string;
      };
      difficulty: {
        assists: {
          disableAutoGear: BooleanInt;
          disableAutoWiper: BooleanInt;
          disableAutosteer: BooleanInt;
          disableIdealLine: BooleanInt;
          disableAutoClutch: BooleanInt;
          disableAutoLights: BooleanInt;
          disableAutoPitLimiter: BooleanInt;
          disableAutoEngineStart: BooleanInt;
          stabilityControlLevelMax: number;
        };
      };
      maxEntries: number;
      closedEntry: boolean;
      driverCategory: SgpDriverCategory;
      tournamentType: SgpTournamentType;
      trackCondition: {
        weather: {
          rain: number;
          cloudLevel: number;
          ambientTemp: number;
          weatherRandomness: number;
          simracerWeatherConditions: null;
          isFixedConditionQualification: null;
        };
      };
      hasGridPositions: boolean;
      practicePassword: null;
      practiceServerName: null;
      enableServerProtection: boolean;
      entryPassword: null;
    };
    status: SgpFlowStatus;
    statusTime: IsoDate;
    sessionName: string;
    gameVersion: string;
    trackId: string;
    trackName: string;
    cars: SgpCar[];
    createdBy: string;
    v: number;
    leagueName: string;
    tournamentName: string;
    serverName: string;
    aliveTime: null;
    carClasses: SgpCarClass[];
    entryListId: string;
    driverSwap: boolean;
    serverStartTime: IsoDate;
    statusHistory: SgpStatusHistory[];
    instanceInfo: [];
    data: {};
    statusInfo: string;
    manualSession: boolean;
  };
  joinConditions: null;
  missingLeaguePermissions: [];
}

export interface SgpEventPoints {
  racePoints: Record<string, { points: number; position: number }>[];
  sessionId: string;
  tournamentId: string;
}

export type SgpEventPointsAdjustments = Record<string, SgpPointsAdjustment[]>[];

export interface SgpPointsAdjustment {
  adjustedBy: {
    id: string;
    name: string;
  };
  date: string;
  id: string;
  points: number;
  reason: string;
}

export interface SgpSessionResults {
  sessionId: string;
  createdBy: string;
  tournamentId: string;
  tournamentType: SgpTournamentType;
  leagueId: string;
  sessionName: string;
  date: IsoDate;
  game: SgpGame;
  gameVersion: string;
  trackId: string;
  trackName: string;
  driverSwap: boolean;
  averageFieldStrength: number;
  rankingStatus: SgpFlowStatus;
  v: number;
  results: SgpSessionResult[];
  manualSession: boolean;
}

interface SgpSessionBaseResult {
  wetTrack: boolean;
  segmentIndex: number;
  bestStats: {
    bestCleanLapTimeMs: LapTimeAsMs;
    bestUncleanLapTimeMs: LapTimeAsMs;
    consistencyPercentage: number;
    averageLapMs: LapTimeAsMs;
    optimalLapTimeMs: LapTimeAsMs;
    bestSectorTimesMs: LapTimeAsMs[];
  };
}

export type SgpSessionResult =
  | SgpSessionPracticeResult
  | SgpSessionQualifyResult
  | SgpSessionRaceResult;

export interface SgpSessionPracticeResult extends SgpSessionBaseResult {
  type: SgpEventType.PRACTICE;
  results: SgpSessionPracticeDriverResult[];
}
export interface SgpSessionQualifyResult extends SgpSessionBaseResult {
  type: SgpEventType.QUALI;
  results: SgpSessionQualifyDriverResult[];
}
export interface SgpSessionRaceResult extends SgpSessionBaseResult {
  type: SgpEventType.RACE;
  results: SgpSessionRaceDriverResult[];
}

export interface SgpSessionPracticeDriverResult {
  carId: string;
  bestLap: number;
  driverId: string;
  lapCount: number;
  position: number;
  carSkinId: string;
  incidents: {
    spins: number;
    offTracks: number;
    pitSpeeding: number;
    collisionsWithCar: number;
    collisionsWithEnv: number;
    collisionsUnclassified: number;
  };
  totalTime: LapTimeAsMs;
  carClassId: string;
  carModelId: string;
  bestLapTime: LapTimeAsMs;
  teamDrivers: null;
  bestCleanLap: number;
  classPosition: number;
  cleanLapCount: number;
  averageLapTime: LapTimeAsMs;
  totalCleanTime: LapTimeAsMs;
  bestCleanLapTime: LapTimeAsMs;
  averageCleanLapTime: LapTimeAsMs;
  participant: {
    id: string;
    name: string;
    country: string;
    avatarUrl: string;
    type: 'DRIVER';
  };
}

export interface SgpSessionQualifyDriverResult extends SgpSessionPracticeDriverResult {
  qualified: boolean;
}

export interface SgpSessionRaceDriverResult extends SgpSessionPracticeDriverResult {
  timeRetired: {
    type: 'TIME' | 'TIMEDIFF';
    value: LapTimeAsMs;
  };
  rankingChange: {
    delta: number;
    newRank: number;
  };
  participant: SgpSessionPracticeDriverResult['participant'] & {
    rankingChange: {
      delta: number;
      newRank: number;
    };
  };
}

export interface SgpSplitStatus {
  splitStatuses: {
    splitNo: number;
    status: SgpFlowStatus;
    splitId: string;
  }[];
  split: {
    splitId: string;
    splitNo: number;
    status: SgpFlowStatus;
    serverName: null;
    server: null;
    passwords: null;
  };
}

export interface SgpChampionship {
  id: string;
  version: number;
  state: {
    leagueId: string;
    name: string;
    type: SgpTournamentType;
    status: SgpFlowStatus;
    startDate: IsoDate;
    description: string;
    participationRules: {
      allowTeams: boolean;
    };
    pointSystem: {
      name: string;
      entries: Record<NumberAsString, number>;
      bestRaceCount: 'all';
    };
    deleted: boolean;
    createdBy: string;
    leagueName: string;
    rulesDescription: string;
    entryRules: {
      maxEntries: number;
      closedEntry: boolean;
      joinAfterStart: boolean;
    };
    generalData: {
      bgImage: string;
      defaultLanguageCode: string;
      aboutTranslations: [];
    };
    gameSettings: {
      cars: SgpCarModel[];
      game: SgpGame;
      carClasses: SgpCarClass[];
      driverSwap: boolean;
      gameVersion: string;
      driverCategory: number;
    };
    endDate: null;
    firstRaceTime: IsoDate;
    nextRaceTime: null;
    lastRaceTime: null;
    eventsLeft: number;
    totalEvents: number;
  };
  joinConditions: null;
}

export interface SgpChampionshipSession {
  id: string;
  v: number;
  createdBy: string;
  sessionName: string;
  startsAt: IsoDate;
  game: SgpGame;
  gameVersion: string;
  leagueId: string;
  leagueName: string;
  tournamentId: string;
  tournamentName: string;
  tournamentType: SgpTournamentType;
  duration: number;
  maxEntries: number;
  activeEntryCount: {
    ADMIN: number;
    REGULAR: number;
    WAITING: number;
    RESERVED: number;
    SPECTATOR: number;
  };
  isParticipant: boolean;
  participationType: 'DRIVER';
  status: SgpFlowStatus;
  trackId: string;
  trackName: string;
  cars: SgpCarModel[];
  isMultiClass: boolean;
  driverSwap: boolean;
  closedEntry: boolean;
  segmentCounts: {
    practice: number;
    qualify: number;
    race: number;
  };
  isRanked: boolean;
  joinConditions: null;
  isMultiSplit: boolean;
  fromRecurringSession: boolean;
  leaguePermissionsMatch: boolean;
  isManual: boolean;
}

export interface SgpRacePoints {
  sessionId: string;
  raceIndex: number;
  points: number;
  position: number;
  included: boolean;
}

export interface SgpChampionshipPointLine {
  participantId: string;
  averageFinish: number;
  points: number;
  wins: number;
  racePoints: SgpRacePoints[];
  participantDetails: {
    driverId: string;
    name: string;
    country: string;
  };
}

export interface SgpChampionshipPoints {
  tournamentId: string;
  lines: SgpChampionshipPointLine[];
  raceOrder: null;
}

interface SgpChampionshipEntryBase {
  car: {
    skin: string;
    model: NumberAsString;
    carClassId?: SgpCategory;
  };
  type: 'REGULAR';
  driverId: string;
  joinDate: IsoDate;
  raceNumber?: number;
  participant: {
    id: string;
    rank: number;
    driverName: string;
    country: string;
    avatarUrl: string;
  };
}

export interface SgpChampionshipActiveEntry extends SgpChampionshipEntryBase {
  status: 'ACTIVE';
}
export interface SgpChampionshipLeftEntry extends SgpChampionshipEntryBase {
  status: 'LEFT';
}

export interface SgpChampionshipBannedEntry extends SgpChampionshipEntryBase {
  status: 'BANNED';
  statusBy: string;
  statusReason: string;
  statusByName: string;
}

export interface SgpChampionshipEntryList {
  entries: SgpChampionshipActiveEntry[];
  splitCount: number;
  splitNo: number;
  joinedSplitNo: number;
  v: number;
  spectators: [];
  inactiveEntries: (SgpChampionshipLeftEntry | SgpChampionshipBannedEntry)[];
  counts: {
    participants: {
      total: number;
      byCar: Record<SgpCarModel['id'], number>;
      byClass: Record<SgpCategory, number>;
    };
    spectators: number;
    inactive: number;
  };
}
