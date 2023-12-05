import { ChangeEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import * as debounce from 'debounce';

import { SimulationParameters, simulate } from './simulate';
import { Props } from '.';
import { readStintSimulatorSettings, storeStintSimulatorSettings } from 'utils/storage';

export interface StintSimulatorInput {
  pitWindowHours?: number;
  pitWindowMins?: number;
  minPitstops?: number;
  maxPitstops?: number;
  pitstopSecs?: number;
  lapDegradationSecs?: string;
  selectedSimulationIndex: number;
}

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
  const [inputs, setInputs] = useState<StintSimulatorInput>(() =>
    readStintSimulatorSettings({
      selectedSimulationIndex: -1,
    })
  );
  const [simulations, setSimulations] = useState<SimulationData[]>([]);

  /*
   * User input update functions
   */
  const updateInput = useCallback(
    (field: keyof StintSimulatorInput) => (value: string | number) => {
      const n = Number(value);
      setInputs((current) => {
        const newInputs = {
          ...current,
          [field]: isNaN(n) ? undefined : n,
        };
        storeStintSimulatorSettings(newInputs);
        return newInputs;
      });
    },
    []
  );

  const updatePitWindowHours = useMemo(() => updateInput('pitWindowHours'), []);
  const updatePitWindowMins = useMemo(() => updateInput('pitWindowMins'), []);
  const updateMinPitstops = useMemo(() => updateInput('minPitstops'), []);
  const updateMaxPitstops = useMemo(() => updateInput('maxPitstops'), []);
  const updatePitstopSecs = useMemo(() => updateInput('pitstopSecs'), []);
  const updateLapDegradationSecs = useMemo(() => updateInput('lapDegradationSecs'), []);
  const updateSelectedSimulation: ChangeEventHandler<HTMLSelectElement> = useMemo(() => {
    const update = updateInput('selectedSimulationIndex');
    return (ev) => update(ev.target.selectedIndex);
  }, []);

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
      updateSelectedSimulation({
        target: { selectedIndex: list.length > 0 ? 0 : -1 },
      } as React.ChangeEvent<HTMLSelectElement>);
    }, SIMULATION_DEBOUNCE_MS),
    []
  );

  useEffect(() => {
    if (!raceDuration || !lapTime) {
      setSimulations([]);
      return;
    }

    const {
      pitWindowHours,
      pitWindowMins,
      pitstopSecs,
      lapDegradationSecs,
      minPitstops,
      maxPitstops,
    } = inputs;

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
  }, [raceDuration, lapTime, totalLaps, fuelPerLap, fuelTank, extraLaps, inputs]);

  return {
    ...inputs,
    simulations,
    updatePitWindowHours,
    updatePitWindowMins,
    updateMinPitstops,
    updateMaxPitstops,
    updatePitstopSecs,
    updateLapDegradationSecs,
    updateSelectedSimulation,
  };
}
