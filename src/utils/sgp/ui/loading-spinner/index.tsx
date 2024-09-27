import { FC } from 'react';
import { createPortal } from 'react-dom';

import styles from './loading-spinner.module.scss';

export interface Props {
  text?: string | boolean;
}

export const LoadingSpinner: FC<Props> = ({ text }) => {
  const showText = typeof text === 'string' && text !== '';
  const popup = (
    <div className={styles.root}>
      <div className={styles.container}>
        {showText && <div className={styles.text}>{text}</div>}
        <div className={styles.spinner} />
      </div>
    </div>
  );
  return createPortal(popup, document.body);
};
