import { SimulationData, LapData, PitStop } from './hooks';

export interface SimulationParameters {
  raceDuration: number;
  lapTime: number;
  windowDuration?: number;
  lapDegradationSecs?: number;
  pitstopSecs?: number;
  stintDurationSecs?: number;
  fuelPerLap?: number;
  fuelTank?: number;
  extraLaps?: number;
}

export function simulate(
  nStops: number,
  {
    raceDuration,
    lapTime,
    windowDuration,
    lapDegradationSecs,
    pitstopSecs,
    fuelPerLap,
    fuelTank,
    stintDurationSecs,
    extraLaps,
  }: SimulationParameters
): SimulationData | undefined {
  const laps: LapData[] = [];
  const stops: PitStop[] = [];

  const pittingTimes: number[] = [];
  const windowOpenTime = windowDuration ? (raceDuration - windowDuration) / 2 : 0;
  const windowCloseTime = raceDuration - (windowDuration ? windowOpenTime : 0);

  if (nStops === 1) {
    // only 1 stop, it's always in the middle of the race
    pittingTimes.push(raceDuration / 2);
  } else if (nStops > 1) {
    // first and last stop are limited by the pit window duration
    const firstStop = Math.max(windowOpenTime, raceDuration / (nStops + 1));
    const lastStop = Math.min(windowCloseTime, (nStops * raceDuration) / (nStops + 1));
    // the rest of the stops can be distributed in between
    const middleTime = lastStop - firstStop;

    pittingTimes.push(firstStop);
    for (let i = 1; i < nStops - 1; i++) {
      pittingTimes.push(firstStop + (i * middleTime) / (nStops - 1));
    }
    pittingTimes.push(lastStop);
  }

  const deltaPerLap = (1000 * (lapDegradationSecs || 0)) / 10;
  let raceTime = 0;
  let lap = 0;
  let stintLap = 0;
  let stintTime = 0;
  while (raceTime < raceDuration) {
    const lapDelta = deltaPerLap * stintLap;
    let currentLapTime = lapTime + lapDelta;
    const windowOpen = raceTime >= windowOpenTime && raceTime <= windowCloseTime;
    const pits = pittingTimes.some(
      (pitTime) => raceTime < pitTime && raceTime + currentLapTime >= pitTime
    );
    if (pits) {
      currentLapTime += (pitstopSecs || 0) * 1000;
    }

    laps.push({
      lapTime: currentLapTime,
      delta: lapDelta,
      stint: stops.length,
      stintLap,
      raceTime,
      width: currentLapTime / lapTime,
      height: 1,
      windowOpen,
      pits,
    });

    if (pits) {
      stops.push({ lap });
      stintLap = 0;
      stintTime = 0;
    } else {
      stintLap++;
      stintTime += currentLapTime;
    }

    lap++;
    raceTime += currentLapTime;
  }

  let initialFuel: number | undefined;
  let totalFuel: number | undefined;

  // if the stint is more than the permitted, this simulation is not valid
  if (stintDurationSecs && stintTime > stintDurationSecs) {
    return;
  }

  if (fuelPerLap) {
    // 1st calculate the used fuel per stint
    const stintFuel: number[] = [];
    for (let i = laps.length - 1; i >= 0; i--) {
      const { stint } = laps[i];
      stintFuel[stint] = (stintFuel[stint] || 0) + fuelPerLap;
    }

    // f***ng floating points, since we are ceiling them, 7.00001 becomes 8,
    // when it actually should be 7... this kinds of fixes it:
    for (let i = 0; i < stintFuel.length; i++) {
      // 3 decimal digits is enough for fuel precision
      stintFuel[i] = Number(stintFuel[i].toFixed(3));
    }

    // then calculate the fuel usage / pctg
    const extraFuel = (extraLaps || 0) * fuelPerLap;
    let fullTank = Math.ceil(extraFuel + Math.max(...stintFuel)) + 1;
    // if the fuel tank is not big enough, this simulation is not valid
    if (fuelTank && fullTank > fuelTank) return;

    initialFuel = Math.ceil(extraFuel + stintFuel[0]);
    totalFuel = initialFuel;
    let fuel = initialFuel;
    let stop = 0;
    for (let i = 0; i < laps.length; i++) {
      const lap = laps[i];
      lap.fuel = fuel;
      lap.height = fuel / fullTank;
      fuel -= fuelPerLap;

      if (lap.pits) {
        const nextStintNeeded = stintFuel[lap.stint + 1] + extraFuel;
        const refuelShort = Math.ceil(nextStintNeeded - 1) + (fuel % 1);
        const refuelLong = Math.ceil(nextStintNeeded) + (fuel % 1);
        const exitFuel = refuelShort > nextStintNeeded ? refuelShort : refuelLong;
        lap.pits = exitFuel - fuel;
        totalFuel += lap.pits;
        stops[stop++].fuel = lap.pits;
        fuel = exitFuel;
      }
    }
  }

  return {
    raceTime,
    laps,
    stops,
    fuelPerLap,
    initialFuel,
    totalFuel,
  };
}
