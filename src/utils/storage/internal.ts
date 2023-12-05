import { FuelCalculatorInput } from 'components/fuel-calculator/hooks';
import { StintSimulatorInput } from 'components/fuel-calculator/stint-simulator/hooks';

export interface StorageData {
  fuelCalculator: FuelCalculatorInput;
  stintSimulator: StintSimulatorInput;
}

export type StorageKey = keyof StorageData;
type NumericKey = {
  [K in StorageKey]: Exclude<StorageData[K], undefined> extends number ? K : never;
}[StorageKey];

export function storeNumericKey(key: NumericKey, value: number) {
  try {
    localStorage.setItem(key, String(value));
  } catch (e) {}
}

export function getNumericKey(key: NumericKey): number {
  try {
    const value = Number(localStorage.getItem(key)) || 0;
    return value;
  } catch (e) {
    return 0;
  }
}

export function increaseNumericKey(key: StorageKey): void {
  try {
    const value = Number(localStorage.getItem(key)) || 0;
    localStorage.setItem(key, String(value + 1));
  } catch (e) {}
}

export function storeValue<T extends StorageKey>(key: T, value: StorageData[T]) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

export function readStoredValue<T extends StorageKey>(
  key: T
): StorageData[T] | undefined {
  try {
    const value = localStorage.getItem(key);
    return value === null ? undefined : (JSON.parse(value) as StorageData[T]);
  } catch (e) {
    return;
  }
}
