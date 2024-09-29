import { getDriverCategory } from './get-driver-category';
import { ActionData, AddPenaltyAdjustment } from './penalty-dialog';

type Options = {
  action: Pick<ActionData, 'type' | 'driver'>;
  undo?: boolean;
};

export function getSrgpActionText({ action, undo }: Options): string {
  let txt: string;
  if (action.type === 'FASTEST_LAP') {
    txt = `Fastest lap${getDriverCategory(action.driver)}`;
  } else if (action.type === 'PENALTY') {
    const { oldPos, newPos } = action as AddPenaltyAdjustment;
    txt = `Post-penalty adjustment: P${oldPos} → P${newPos}`;
  } else if (action.type === 'PP') {
    txt = `Judged penalties for ${action.driver.name}`;
  } else {
    txt = 'Unknown action';
  }

  return undo ? `Undo: ${txt}` : txt;
}
