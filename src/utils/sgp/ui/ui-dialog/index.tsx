import { FC, MouseEvent, ReactNode, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { UiButton } from '../ui-button';

import styles from './ui-dialog.module.scss';

export interface Props {
  title?: ReactNode;
  children?: ReactNode;
  onClose: () => void;
}

export const UiDialog: FC<Props> = ({ title, children, onClose }) => {
  const close = useCallback(() => onClose(), []);
  const cancelEvent = useCallback((ev: MouseEvent) => ev.stopPropagation(), []);

  const popup = (
    <div className={styles.root} onClick={close}>
      <div className={styles.container} onClick={cancelEvent}>
        <div className={styles.header}>
          <div>{title}</div>
          <UiButton className={styles.closeButton} onClick={close}>
            <svg viewBox='0 0 24 24'>
              <path d='M7,7 L17,17 M7,17 L17,7'></path>
            </svg>
          </UiButton>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
  return createPortal(popup, document.body);
};
