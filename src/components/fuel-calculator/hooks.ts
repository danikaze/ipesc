import { ChangeEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { readFuelCalculatorSettings, storeFuelCalculatorSettings } from 'utils/storage';

export interface FuelCalculatorInput {
  mode: 'acc' | 'ac' | 'enduro';
  raceTimeHours: string;
  raceTimeMins: string;
  lapTimeMins: string;
  lapTimeSecs: string;
  fuelPerLap: string;
  fuelTank: string;
  extraLaps: string;
}

interface Summary {
  /** Average lap time in ms  */
  lapMs: number;
  totalLaps: number;
  totalFuel: number;
  /** Race duration in ms */
  raceMs: number;
  /** Actual race time (to the last lap) in ms */
  raceTime: number;
}

export function useFuelCalculator() {
  // input fields
  const [inputs, setInputs] = useState<FuelCalculatorInput>(() =>
    readFuelCalculatorSettings({
      mode: 'acc',
      raceTimeHours: '',
      raceTimeMins: '',
      lapTimeMins: '',
      lapTimeSecs: '',
      fuelPerLap: '',
      fuelTank: '',
      extraLaps: '',
    })
  );
  // calculated fields
  const [summary, setSummary] = useState<Summary | undefined>();

  /*
   * User input update functions
   */
  const updateInput = useCallback(
    (field: keyof FuelCalculatorInput) => (value: string) => {
      setInputs((current) => {
        const newInputs = {
          ...current,
          [field]: value,
        };

        storeFuelCalculatorSettings(newInputs);
        return newInputs;
      });
    },
    []
  );

  const updateMode: ChangeEventHandler<HTMLSelectElement> = useMemo(() => {
    const update = updateInput('mode');
    return (ev) => update(ev.target.value);
  }, []);
  const updateRaceTimeHours = useMemo(() => updateInput('raceTimeHours'), []);
  const updateRaceTimeMins = useMemo(() => updateInput('raceTimeMins'), []);
  const updateLapTimeMins = useMemo(() => updateInput('lapTimeMins'), []);
  const updateLapTimeSecs = useMemo(() => updateInput('lapTimeSecs'), []);
  const updateFuelPerLap = useMemo(() => updateInput('fuelPerLap'), []);
  const updateFuelTank = useMemo(() => updateInput('fuelTank'), []);
  const updateExtraLaps = useMemo(() => updateInput('extraLaps'), []);

  /*
   * Calculations updates
   */
  useEffect(
    () =>
      setSummary(() => {
        const raceMs =
          (Number(inputs.raceTimeHours) || 0) * 3_600_000 +
          (Number(inputs.raceTimeMins) || 0) * 60_000;
        if (!raceMs) return;

        const lapMs =
          (Number(inputs.lapTimeMins) || 0) * 60_000 +
          (Number(inputs.lapTimeSecs) || 0) * 1000;
        if (!lapMs) return;

        const usedFuel = Number(inputs.fuelPerLap) || 0;
        const lapsToAdd = Number(inputs.extraLaps) || 0;
        const totalLaps = Math.ceil(raceMs / lapMs + lapsToAdd);
        const totalFuel = Math.ceil(totalLaps * usedFuel);
        const raceTime = totalLaps * lapMs;

        return {
          totalLaps,
          totalFuel,
          lapMs,
          raceMs,
          raceTime,
        };
      }),
    [inputs]
  );

  return {
    ...inputs,
    ...summary,
    updateMode,
    updateRaceTimeHours,
    updateRaceTimeMins,
    updateLapTimeMins,
    updateLapTimeSecs,
    updateFuelPerLap,
    updateFuelTank,
    updateExtraLaps,
  };
}
