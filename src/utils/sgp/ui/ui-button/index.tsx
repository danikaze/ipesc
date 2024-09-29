import { clsx } from 'clsx';
import { FC, ReactNode, useMemo } from 'react';

import styles from './ui-button.module.scss';

export interface Props {
  children?: ReactNode;
  disabled?: boolean;
  title?: string;
  className?: string;
  onClick: () => void;
}

export const UiButton: FC<Props> = ({
  children,
  disabled,
  title,
  className,
  onClick,
}) => {
  const click = useMemo(
    () => (disabled ? undefined : () => onClick()),
    [onClick, disabled]
  );

  return (
    <div
      title={title}
      onClick={click}
      className={clsx(styles.root, disabled && styles.disabled, className)}
    >
      {children}
    </div>
  );
};
