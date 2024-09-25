import { Championship } from 'data/types';
import { isChampionship } from './is-championship';

export function getDefaultChampionship(
  list: undefined | Championship[]
): Championship | undefined;
export function getDefaultChampionship(list: undefined | string[]): string | undefined;
export function getDefaultChampionship(
  list: undefined | string[] | Championship[]
): string | Championship | undefined {
  if (!list || list.length === 0) return undefined;

  if (isStringList(list)) {
    return list
      .filter((c) => c && isChampionship(c))
      .sort((a, b) => Number(a.substring(1)) - Number(b.substring(1)))
      .pop();
  }

  return list
    .filter((c) => c.customName && isChampionship(c.customName))
    .sort(
      (a, b) => Number(a.customName?.substring(1)) - Number(b.customName?.substring(1))
    )
    .pop();
}

function isStringList(list: string[] | Championship[]): list is string[] {
  return list[0] === 'string';
}
