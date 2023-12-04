import { ChangeEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import * as debounce from 'debounce';

import { SimulationParameters, simulate } from './simulate';
import { Props } from '.';

export interface SimulationData {
  raceTime: number;
  stops: PitStop[];
  laps: LapData[];
  fuelPerLap?: number;
  initialFuel?: number;
  totalFuel?: number;
}

export interface PitStop {
  lap: number;
  fuel?: number;
}

export interface LapData {
  /** Current lap time in ms */
  lapTime: number;
  /** Expected delta from the average lap time */
  delta: number;
  /** Ellapes race time */
  raceTime: number;
  /** Stint number (starting on 0) */
  stint: number;
  /** Lap number of the current stint */
  stintLap: number;
  /** Width ratio being 1 = average lap time */
  width: number;
  /** Height ratio being 1 = full fuel tank */
  height: number;
  /** Pit Window is open in this lap */
  windowOpen?: boolean;
  /** This lap needs to pit. Number of litres to add when available */
  pits?: boolean | number;
  /** Expected remaining fuel */
  fuel?: number;
}

const SIMULATION_DEBOUNCE_MS = 50;

export function useStintSimulator({
  raceDuration,
  lapTime,
  totalLaps,
  fuelPerLap,
  fuelTank,
  extraLaps,
}: Props) {
  // input fields
  const [pitWindowHours, setPitWindowHours] = useState<number | undefined>();
  const [pitWindowMins, setPitWindowMins] = useState<number | undefined>();
  const [minPitstops, setMinPitstops] = useState<number | undefined>();
  const [maxPitstops, setMaxPitstops] = useState<number | undefined>();
  const [pitstopSecs, setPitstopSecs] = useState<number | undefined>();
  const [lapDegradationSecs, setLapDegradationSecs] = useState<string | undefined>();
  const [selectedSimulationIndex, setSelectedSimulationIndex] = useState<number>(-1);
  const [simulations, setSimulations] = useState<SimulationData[]>([]);

  /*
   * User input update functions
   */
  const updateInput = useCallback(
    (set: (value: number | undefined) => void) => (value: string) => {
      const n = Number(value);
      set(isNaN(n) ? undefined : n);
    },
    []
  );

  const updatePitWindowHours = useMemo(() => updateInput(setPitWindowHours), []);
  const updatePitWindowMins = useMemo(() => updateInput(setPitWindowMins), []);
  const updateMinPitstops = useMemo(() => updateInput(setMinPitstops), []);
  const updateMaxPitstops = useMemo(() => updateInput(setMaxPitstops), []);
  const updatePitstopSecs = useMemo(() => updateInput(setPitstopSecs), []);
  const updateLapDegradationSecs = setLapDegradationSecs;
  const updateSelectedSimulation: ChangeEventHandler<HTMLSelectElement> = useCallback(
    (ev) => setSelectedSimulationIndex(() => ev.target.selectedIndex),
    []
  );

  /*
   * Calculations updates
   */
  const doSimulation = useCallback(
    debounce((minPitstops: number, maxPitstops: number, data: SimulationParameters) => {
      const list: SimulationData[] = [];
      for (let nStops = minPitstops; nStops <= maxPitstops; nStops++) {
        const res = simulate(nStops, data);
        res && list.push(res);
      }

      list.sort((a, b) => {
        const lapDiff = b.laps.length - a.laps.length;
        return lapDiff !== 0 ? lapDiff : a.raceTime - b.raceTime;
      });

      setSimulations(list);
      setSelectedSimulationIndex(list.length > 0 ? 0 : -1);
    }, SIMULATION_DEBOUNCE_MS),
    []
  );

  useEffect(() => {
    if (!raceDuration || !lapTime) {
      setSimulations([]);
      return;
    }

    const windowDuration = (() => {
      const t = (pitWindowHours || 0) * 3_600_000 + (pitWindowMins || 0) * 60_000;
      return t ? t : raceDuration;
    })();
    const data = {
      raceDuration,
      lapTime,
      totalLaps,
      windowDuration,
      pitstopSecs,
      fuelPerLap,
      fuelTank,
      extraLaps,
      lapDegradationSecs: Number(lapDegradationSecs) || undefined,
    };

    doSimulation(minPitstops || 0, maxPitstops || 0, data)!;
  }, [
    raceDuration,
    lapTime,
    totalLaps,
    fuelPerLap,
    fuelTank,
    extraLaps,
    pitWindowHours,
    pitWindowMins,
    minPitstops,
    maxPitstops,
    pitstopSecs,
    lapDegradationSecs,
  ]);

  return {
    simulations,
    pitWindowHours,
    pitWindowMins,
    minPitstops,
    maxPitstops,
    pitstopSecs,
    lapDegradationSecs,
    selectedSimulationIndex,
    updatePitWindowHours,
    updatePitWindowMins,
    updateMinPitstops,
    updateMaxPitstops,
    updatePitstopSecs,
    updateLapDegradationSecs,
    updateSelectedSimulation,
  };
}
