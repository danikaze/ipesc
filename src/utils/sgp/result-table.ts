import { timeToMs } from './time-to-ms';

export const enum SgpCategory {
  PRO = 'PRO',
  SILVER = 'SIL',
  AM = 'AM',
}

export interface SgpRaceResult {
  pos?: number;
  driver?: string;
  car?: string;
  category?: SgpCategory;
  laps?: number;
  totalTime?: string;
  totalTimeMs?: number;
  bestLap?: string;
  bestLapMs?: number;
  points?: number;
  penalty?: number;
  pointsAdjustment?: number;
  totalPoints?: number;
}

export interface SgpQualiPracticeResult {
  pos?: number;
  driver?: string;
  car?: string;
  category?: SgpCategory;
  laps?: number;
  totalTime?: string;
  totalTimeMs?: number;
  bestLap?: string;
  bestLapMs?: number;
  incidents?: number;
}

const enum SgpResultTableType {
  RACE,
  QUALI_PRACTICE,
}

const enum SgpRaceResultColIndex {
  POS,
  DRIVER,
  LICENSE,
  RANK,
  CATEGORY,
  LAPS,
  TOTAL_TIME,
  BESTLAP,
  POINTS,
  POINTS_ADJ,
  TOTAL_POINTS,
  PENALTY,
}

const enum SgpQualiPracticeResultColIndex {
  POS,
  DRIVER,
  CAR,
  CATEGORY,
  BESTLAP,
  LAPS,
  TOTAL_TIME,
  INCIDENTS,
}

export class SgpResultTable {
  private table: HTMLTableElement;

  constructor(table: HTMLTableElement) {
    this.table = table;
  }

  private static getNumber(
    tr: HTMLTableRowElement,
    index: SgpRaceResultColIndex | SgpQualiPracticeResultColIndex
  ): number | undefined {
    const td = tr.children[index] as HTMLTableCellElement;
    return Number(td?.innerText) ?? undefined;
  }

  private static getString(
    tr: HTMLTableRowElement,
    index: SgpRaceResultColIndex | SgpQualiPracticeResultColIndex
  ): string | undefined {
    const td = tr.children[index] as HTMLTableCellElement;
    return td?.innerText;
  }

  private static getCategory(
    tr: HTMLTableRowElement,
    index: SgpRaceResultColIndex | SgpQualiPracticeResultColIndex
  ): SgpCategory | undefined {
    const td = tr.children[index] as HTMLTableCellElement;
    const cat = td?.innerText?.toUpperCase();
    return cat === 'PRO'
      ? SgpCategory.PRO
      : cat === 'SIL'
      ? SgpCategory.SILVER
      : cat === 'AM'
      ? SgpCategory.AM
      : undefined;
  }

  public scrapResults(): SgpRaceResult[] {
    const type = this.getTableType();
    if (type === undefined) {
      throw new Error('Table type not supported.');
    }
    const scrap =
      type === SgpResultTableType.RACE
        ? SgpResultTable.scrapRaceRow
        : SgpResultTable.scrapQualiRow;

    return Array.from(this.table.querySelectorAll<HTMLTableRowElement>('tbody tr')).map(
      (tr) => scrap(tr)
    );
  }

  private getTableType(): SgpResultTableType | undefined {
    const n = this.table.querySelector('tr')?.children.length;
    return n === 12
      ? SgpResultTableType.RACE
      : n === 8
      ? SgpResultTableType.QUALI_PRACTICE
      : undefined;
  }

  private static scrapRaceRow(tr: HTMLTableRowElement): SgpRaceResult {
    const totalTime = SgpResultTable.getString(tr, SgpRaceResultColIndex.TOTAL_TIME);
    const bestLap = SgpResultTable.getString(tr, SgpRaceResultColIndex.BESTLAP);
    const driverText = SgpResultTable.getString(tr, SgpRaceResultColIndex.DRIVER);

    return {
      pos: SgpResultTable.getNumber(tr, SgpRaceResultColIndex.POS),
      driver: driverText?.split('\n')[0],
      car: driverText?.split('\n')[1],
      category: SgpResultTable.getCategory(tr, SgpRaceResultColIndex.CATEGORY),
      laps: SgpResultTable.getNumber(tr, SgpRaceResultColIndex.LAPS),
      totalTime,
      totalTimeMs: timeToMs(totalTime),
      bestLap,
      bestLapMs: timeToMs(bestLap),
      points: SgpResultTable.getNumber(tr, SgpRaceResultColIndex.POINTS),
      penalty: SgpResultTable.getNumber(tr, SgpRaceResultColIndex.PENALTY),
      totalPoints: SgpResultTable.getNumber(tr, SgpRaceResultColIndex.TOTAL_POINTS),
      pointsAdjustment: SgpResultTable.getNumber(tr, SgpRaceResultColIndex.POINTS_ADJ),
    };
  }

  private static scrapQualiRow(tr: HTMLTableRowElement): SgpQualiPracticeResult {
    const totalTime = SgpResultTable.getString(
      tr,
      SgpQualiPracticeResultColIndex.TOTAL_TIME
    );
    const bestLap = SgpResultTable.getString(tr, SgpQualiPracticeResultColIndex.BESTLAP);

    return {
      pos: SgpResultTable.getNumber(tr, SgpQualiPracticeResultColIndex.POS),
      driver: SgpResultTable.getString(tr, SgpQualiPracticeResultColIndex.DRIVER),
      car: SgpResultTable.getString(tr, SgpQualiPracticeResultColIndex.CAR),
      category: SgpResultTable.getCategory(tr, SgpQualiPracticeResultColIndex.CATEGORY),
      totalTime,
      totalTimeMs: timeToMs(totalTime),
      bestLap,
      bestLapMs: timeToMs(bestLap),
      laps: SgpResultTable.getNumber(tr, SgpQualiPracticeResultColIndex.LAPS),
      incidents: SgpResultTable.getNumber(tr, SgpQualiPracticeResultColIndex.INCIDENTS),
    };
  }
}
