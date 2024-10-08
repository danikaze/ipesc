import { AccVersion, Event, Game } from 'data/types';
import { Timestamp } from './types';

const RELEASE_16 = new Date('2020-11-18').getTime();
const RELEASE_18 = new Date('2021-11-24').getTime();
const RELEASE_19 = new Date('2023-04-19').getTime();
const RELEASE_196 = new Date('2024-01-24').getTime();

export function isEventFromAccVersion(event: Event, accVersion?: AccVersion): boolean {
  return isTimeFromVersion(event.startTime, accVersion);
}

export function getAccVersionFromTime(
  game: Game | undefined,
  time: Timestamp
): AccVersion | undefined {
  if (game !== Game.ACC) return;

  if (time < RELEASE_16) return AccVersion.PRE_V_16;
  if (time < RELEASE_18) return AccVersion.V_16;
  if (time < RELEASE_19) return AccVersion.V_18;
  if (time < RELEASE_196) return AccVersion.V_19;
  return AccVersion.V_196;
}

function isTimeFromVersion(time: Timestamp, accVersion?: AccVersion): boolean {
  if (accVersion === AccVersion.PRE_V_16 && time >= RELEASE_16) {
    return false;
  }
  if (accVersion === AccVersion.V_16 && (time < RELEASE_16 || time >= RELEASE_18)) {
    return false;
  }
  if (accVersion === AccVersion.V_18 && (time < RELEASE_18 || time >= RELEASE_19)) {
    return false;
  }
  if (accVersion === AccVersion.V_19 && time < RELEASE_19) {
    return false;
  }

  return true;
}
