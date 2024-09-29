import { DriverInfo } from 'utils/sgp/event-api-data';

export function getDriverCategory(driver: DriverInfo): string {
  if (!driver.category) return '';

  const category = driver.category.toUpperCase();
  return category.startsWith('P')
    ? ' (PRO)'
    : category.startsWith('S')
    ? ' (SILVER)'
    : ' (AM)';
}
