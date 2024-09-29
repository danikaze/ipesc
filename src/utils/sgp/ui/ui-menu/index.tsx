import { FC } from 'react';

import { DiscordButton } from '../data/discord-button';
import { JsonButton } from '../data/json-button';
import { PenaltyButton } from '../penalties/penalty-button';

import styles from './ui-menu.module.scss';

export const UiMenu: FC = () => {
  return (
    <div className={styles.root}>
      <JsonButton />
      <DiscordButton />
      <PenaltyButton />
    </div>
  );
};
