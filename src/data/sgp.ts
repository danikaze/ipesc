import { SgpGame, SgpCategory, SgpEventType } from 'utils/sgp/types';
import { Game, Category, EventType } from './types';

export function sgpGame2Game(game: SgpGame | undefined): Game | undefined {
  if (game === SgpGame.ACC) return Game.ACC;
  if (game === SgpGame.AC) return Game.AC;
  if (game === SgpGame.RACE_ROOM) return Game.RACE_ROOM;
  if (game === SgpGame.AUTOMOBILISTA_2) return Game.AUTOMOBILISTA_2;
  if (game === SgpGame.F1_23) return Game.F1_23;
}

export function sgpCategory2Category(cat: SgpCategory | undefined): Category | undefined {
  if (!cat) return;
  return cat[0].toUpperCase() as Category;
}

export function sgpEventType2EventType(type: SgpEventType): EventType | undefined {
  if (type === SgpEventType.QUALI) return 'quali';
  if (type === SgpEventType.RACE) return 'race';
}
