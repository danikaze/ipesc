import { StorageData, readStoredValue, storeValue } from './internal';

export function storeFuelCalculatorSettings(
  updatedData: StorageData['fuelCalculator']
): void {
  storeValue('fuelCalculator', updatedData);
}

export function readFuelCalculatorSettings(
  defaultValue: StorageData['fuelCalculator']
): StorageData['fuelCalculator'] {
  return readStoredValue('fuelCalculator') || defaultValue;
}

export function storeStintSimulatorSettings(
  updatedData: StorageData['stintSimulator']
): void {
  storeValue('stintSimulator', updatedData);
}

export function readStintSimulatorSettings(
  defaultValue: StorageData['stintSimulator']
): StorageData['stintSimulator'] {
  return readStoredValue('stintSimulator') || defaultValue;
}
