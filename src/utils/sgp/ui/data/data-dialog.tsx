import { clsx } from 'clsx';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useUiContext } from '../context';
import { UiDialog } from '../ui-dialog';

import styles from './data.module.scss';

const SHOW_COPY_MSG_MS = 1500;

export const DiscordDialog: FC = () => {
  const { setDialogData, dialogMessageData } = useUiContext();
  const [copied, setCopied] = useState(false);
  const timeRef = useRef(0);

  const close = useCallback(() => setDialogData(undefined), []);
  const copy = useCallback(() => {
    if (dialogMessageData?.content) {
      navigator.clipboard.writeText(dialogMessageData?.content);
      setCopied(true);
    }
    timeRef.current && clearTimeout(timeRef.current);
    timeRef.current = window.setTimeout(() => setCopied(false), SHOW_COPY_MSG_MS);
  }, [dialogMessageData]);

  useEffect(copy, []);

  const title = (
    <div>
      {dialogMessageData?.title}
      <span title='Copy' onClick={copy} className={styles.copyIcon}>
        ⎘
      </span>
      <span className={clsx(styles.copiedMsg, copied && styles.show)}>Copied!</span>
    </div>
  );

  return (
    <UiDialog title={title} onClose={close}>
      <pre>{dialogMessageData?.content}</pre>
    </UiDialog>
  );
};
