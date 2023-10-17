import { highlight, languages } from 'prismjs';
import { FC, useCallback, useMemo, useState } from 'react';
import { Button } from '@chakra-ui/button';

import 'prismjs/themes/prism-tomorrow.min.css';
import styles from './code-block.module.scss';

export interface Props {
  children?: string;
  noCopyButton?: boolean;
  withCaret?: boolean;
}

const BUTTON_TEXT_FEEDBACK_MS = 1500;
const BUTTON_TEXT_DEFAULT = 'Copy';
const BUTTON_TEXT_FEEDBACK = 'Copied';

export const CodeBlock: FC<Props> = ({ children, noCopyButton, withCaret }) => {
  const [buttonText, setButtonText] = useState<string>(BUTTON_TEXT_DEFAULT);
  const code = useMemo(
    () => highlight(children || '', languages.javascript, 'javascript'),
    [children]
  );

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(children || '');
    setButtonText(BUTTON_TEXT_FEEDBACK);
    setTimeout(setButtonText, BUTTON_TEXT_FEEDBACK_MS, BUTTON_TEXT_DEFAULT);
  }, [children]);

  const copyButton = !noCopyButton && (
    <Button size='xs' colorScheme='linkedin' className={styles.button} onClick={copyCode}>
      {buttonText}
    </Button>
  );

  const caret = withCaret && <pre className={styles.caret}>&gt;</pre>;

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        {copyButton}
        {caret}
        <pre className={styles.code}>
          <code className='language-js' dangerouslySetInnerHTML={{ __html: code }} />
        </pre>
      </div>
    </div>
  );
};
