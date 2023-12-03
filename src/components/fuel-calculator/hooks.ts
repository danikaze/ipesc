import { ChangeEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { msToTime } from 'utils/time';

interface State {
  totalLaps: number;
  totalFuel: number;
  raceTime: string;
}

export function useFuelCalculator() {
  // input fields
  const [mode, setMode] = useState<string>('acc');
  const [raceTimeHours, setRaceTimeHours] = useState<string>('');
  const [raceTimeMins, setRaceTimeMins] = useState<string>('');
  const [lapTimeMins, setLapTimeMins] = useState<string>('');
  const [lapTimeSecs, setLapTimeSecs] = useState<string>('');
  const [fuelPerLap, setFuelPerLap] = useState<string>('');
  const [extraLaps, setExtraLaps] = useState<string>('');
  // calculated fields
  const [summary, setSummary] = useState<State | undefined>();

  /*
   * User input update functions
   */
  const updateInput = useCallback(
    (set: (value: string) => void) => (value: string) => set(value),
    []
  );

  const updateMode: ChangeEventHandler<HTMLSelectElement> = useCallback(
    (ev) => setMode(ev.target.value),
    []
  );
  const updateRaceTimeHours = useMemo(() => updateInput(setRaceTimeHours), []);
  const updateRaceTimeMins = useMemo(() => updateInput(setRaceTimeMins), []);
  const updateLapTimeMins = useMemo(() => updateInput(setLapTimeMins), []);
  const updateLapTimeSecs = useMemo(() => updateInput(setLapTimeSecs), []);
  const updateFuelPerLap = useMemo(() => updateInput(setFuelPerLap), []);
  const updateExtraLaps = useMemo(() => updateInput(setExtraLaps), []);

  /*
   * Calculations updates
   */
  useEffect(
    () =>
      setSummary(() => {
        const raceMs =
          (Number(raceTimeHours) || 0) * 3_600_000 + (Number(raceTimeMins) || 0) * 60_000;
        if (!raceMs) return;

        const lapMs =
          (Number(lapTimeMins) || 0) * 60_000 + (Number(lapTimeSecs) || 0) * 1000;
        if (!lapMs) return;

        const usedFuel = Number(fuelPerLap) || 0;
        const lapsToAdd = Number(extraLaps) || 0;
        const totalLaps = Math.ceil(raceMs / lapMs + lapsToAdd);
        const totalFuel = Math.ceil(totalLaps * usedFuel);
        const raceTime = totalLaps * lapMs;

        return {
          totalLaps,
          totalFuel,
          raceTime: msToTime(raceTime, { ms: false })!,
        };
      }),
    [raceTimeHours, raceTimeMins, lapTimeMins, lapTimeSecs, fuelPerLap, extraLaps]
  );

  return {
    mode,
    raceTimeHours,
    raceTimeMins,
    lapTimeMins,
    lapTimeSecs,
    fuelPerLap,
    extraLaps,
    ...summary,
    updateMode,
    updateRaceTimeHours,
    updateRaceTimeMins,
    updateLapTimeMins,
    updateLapTimeSecs,
    updateFuelPerLap,
    updateExtraLaps,
  };
}
