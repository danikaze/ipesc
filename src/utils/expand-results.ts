import { SgpQualiPracticeResult, SgpRaceResult } from './sgp/result-table';
import { timeToMs } from './sgp/time-to-ms';

export interface ExpandedSgpRaceResult extends SgpRaceResult {
  totalTimeMs?: number;
  bestLapMs?: number;
}

export interface ExpandedSgpQualiPracticeResult extends SgpQualiPracticeResult {
  totalTimeMs?: number;
  bestLapMs?: number;
}

export function expandRaceResults(results: SgpRaceResult): ExpandedSgpRaceResult {
  const expanded: ExpandedSgpRaceResult = { ...results };
  if (results.bestLap) {
    expanded.bestLapMs = timeToMs(results.bestLap);
  }
  if (results.totalTime) {
    expanded.totalTimeMs = timeToMs(results.totalTime);
  }
  return expanded;
}

export function expandQualiPracticeResults(
  results: ExpandedSgpQualiPracticeResult
): SgpQualiPracticeResult {
  const expanded: SgpQualiPracticeResult = { ...results };
  if (results.bestLap) {
    expanded.bestLapMs = timeToMs(results.bestLap);
  }
  if (results.totalTime) {
    expanded.totalTimeMs = timeToMs(results.totalTime);
  }
  return expanded;
}
