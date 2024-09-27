import { FC, useCallback } from 'react';
import { formatResultsMessageForDiscord } from 'utils/format-results-message-for-discord';
import { fetchEventData } from 'utils/sgp/fetch-event-data';
import { SgpPage } from 'utils/sgp/get-sgp-page';
import { useUiContext } from '../context';
import { UiButton } from '../ui-button';

const DIALOG_TITLE = 'Message for Discord';

export const DiscordButton: FC = () => {
  const { page, setLoading, setDialogData } = useUiContext();
  const disabled = page !== SgpPage.EVENT;
  const title = disabled
    ? 'Need to be on a finished event to get the message for Discord'
    : 'Get the message for Discord';

  const click = useCallback(async () => {
    setLoading('Fetching data...');
    try {
      const data = await fetchEventData();
      if (!data) throw new Error('No data');
      if (!data.isFinished()) {
        throw new Error(`No results available or the event hasn't finished yet`);
      }
      const msg = formatResultsMessageForDiscord(data);
      setLoading(false);
      setDialogData(DIALOG_TITLE, msg);
    } catch (e) {
      setLoading(false);
      setDialogData(DIALOG_TITLE, 'Error while retrieving the data.');
    }
  }, []);

  return (
    <UiButton disabled={disabled} title={title} onClick={click}>
      D
    </UiButton>
  );
};
