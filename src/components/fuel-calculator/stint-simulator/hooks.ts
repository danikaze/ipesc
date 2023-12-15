import { ChangeEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import * as debounce from 'debounce';

import { SimulationParameters, simulate } from './simulate';
import { Props } from '.';
import { readStintSimulatorSettings, storeStintSimulatorSettings } from 'utils/storage';

export interface StintSimulatorInput {
  pitWindowHours?: string;
  pitWindowMins?: string;
  minPitstops?: number;
  maxPitstops?: number;
  stintDurationHours?: string;
  stintDurationMins?: string;
  pitstopSecs?: string;
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
const MAX_SIMULATIONS = 5;

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
    (field: keyof StintSimulatorInput, asNumber?: boolean) =>
      (value: string | number) => {
        setInputs((current) => {
          const n = asNumber ? Number(value) : value;
          if (current[field] === n) {
            return current;
          }
          const newInputs = {
            ...current,
            [field]: asNumber && isNaN(n as number) ? undefined : n,
          };
          storeStintSimulatorSettings(newInputs);
          return newInputs;
        });
      },
    []
  );

  const updatePitWindowHours = useMemo(() => updateInput('pitWindowHours'), []);
  const updatePitWindowMins = useMemo(() => updateInput('pitWindowMins'), []);
  const updateMinPitstops = useMemo(() => updateInput('minPitstops', true), []);
  const updateMaxPitstops = useMemo(() => updateInput('maxPitstops', true), []);
  const updatePitstopSecs = useMemo(() => updateInput('pitstopSecs'), []);
  const updateStintDurationHours = useMemo(() => updateInput('stintDurationHours'), []);
  const updateStintDurationMins = useMemo(() => updateInput('stintDurationMins'), []);
  const updateLapDegradationSecs = useMemo(() => updateInput('lapDegradationSecs'), []);
  const updateSelectedSimulation: ChangeEventHandler<HTMLSelectElement> = useMemo(() => {
    const update = updateInput('selectedSimulationIndex', true);
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

      setSimulations(
        list
          // remove simulations with the same number of stops (repeated)
          .filter(
            (sim, i) =>
              list.findIndex(({ stops }) => stops.length === sim.stops.length) === i
          )
          .splice(0, MAX_SIMULATIONS)
      );
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
      stintDurationHours,
      stintDurationMins,
    } = inputs;

    const windowDuration = (() => {
      const t =
        (Number(pitWindowHours) || 0) * 3_600_000 + (Number(pitWindowMins) || 0) * 60_000;
      return t ? t : raceDuration;
    })();

    const stintDurationSecs =
      (Number(stintDurationHours) || 0) * 3_600_000 +
      (Number(stintDurationMins) || 0) * 60_000;

    const data: SimulationParameters = {
      raceDuration,
      lapTime,
      windowDuration,
      pitstopSecs: Number(pitstopSecs),
      fuelPerLap,
      fuelTank,
      extraLaps,
      stintDurationSecs,
      lapDegradationSecs: Number(lapDegradationSecs) || undefined,
    };

    const min = Number(minPitstops) || 0;
    const max = Number(maxPitstops) || min + MAX_SIMULATIONS;
    doSimulation(min, max, data)!;
  }, [raceDuration, lapTime, totalLaps, fuelPerLap, fuelTank, extraLaps, inputs]);

  return {
    ...inputs,
    simulations,
    updatePitWindowHours,
    updatePitWindowMins,
    updateMinPitstops,
    updateMaxPitstops,
    updatePitstopSecs,
    updateStintDurationHours,
    updateStintDurationMins,
    updateLapDegradationSecs,
    updateSelectedSimulation,
  };
}
