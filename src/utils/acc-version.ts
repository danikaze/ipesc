import { AccVersion, Event } from 'data/types';
import { Timestamp } from './types';

const RELEASE_16 = new Date('2020-11-18').getTime();
const RELEASE_18 = new Date('2021-11-24').getTime();
const RELEASE_19 = new Date('2023-04-19').getTime();

export function isEventFromAccVersion(event: Event, accVersion?: AccVersion): boolean {
  return isTimeFromVersion(event.startTime, accVersion);
}

export function getAccVersionFromTime(time: Timestamp): AccVersion {
  if (time < RELEASE_16) return AccVersion.PRE_V_16;
  if (time < RELEASE_18) return AccVersion.V_16;
  if (time < RELEASE_19) return AccVersion.V_18;
  return AccVersion.V_19;
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
