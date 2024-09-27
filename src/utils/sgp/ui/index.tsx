import { FC, useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { onUrlChange } from 'utils/on-url-change';
import { getSgpPage, SgpPage } from '../get-sgp-page';
import { UiContext } from './context';
import { DiscordDialog } from './data/data-dialog';
import { LoadingSpinner } from './loading-spinner';
import { UiMenu } from './ui-menu';

export function injectUi(): void {
  const root = createRoot(getContainer());
  root.render(<Ui />);
}

function getContainer(): HTMLElement {
  const CONTAINER_ID = 'ipesc-ui';
  let container = document.getElementById(CONTAINER_ID);
  if (container) return container;

  container = document.createElement('div');
  container.id = 'ipesc-ui';
  document.body.appendChild(container);

  return container;
}

export type DialogData = { title: string; content: string };

const Ui: FC = () => {
  const [page, setPage] = useState<SgpPage | undefined>(getSgpPage(location.href));
  const [dialogMessageData, setDialogMessageData] = useState<DialogData | undefined>();
  const [isLoading, setLoading] = useState<string | boolean>(false);

  useEffect(() => {
    return onUrlChange((newUrl) => setPage(getSgpPage(newUrl)));
  }, []);

  const setDialogData = useCallback(
    (title?: string, content?: string) =>
      setDialogMessageData(title ? ({ title, content } as DialogData) : undefined),
    []
  );

  return (
    <UiContext
      value={{
        page,
        setLoading,
        dialogMessageData,
        setDialogData,
      }}
    >
      <UiMenu />
      {isLoading && <LoadingSpinner />}
      {dialogMessageData && <DiscordDialog />}
    </UiContext>
  );
};