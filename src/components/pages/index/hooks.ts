import { useEffect, useRef } from 'react';

import styles from './index.module.scss';

export function useIndexPage() {
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const keyList: string[] = [];
    const KONAMI =
      'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,KeyB,KeyA';
    const handler = ({ code }: KeyboardEvent) => {
      console.log();
      keyList.push(code);
      if (keyList.length > 10) keyList.shift();
      if (keyList.join(',') === KONAMI) {
        logoRef.current?.classList.remove(styles.rotate);
        setTimeout(() => logoRef.current?.classList.add(styles.rotate), 1);
      }
    };
    document.body.addEventListener('keydown', handler);

    return () => document.body.removeEventListener('keydown', handler);
  }, []);

  return { logoRef };
}
