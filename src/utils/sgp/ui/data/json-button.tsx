import { FC, useCallback } from 'react';
import { fetchChampionshipData } from 'utils/sgp/fetch-championship-data';
import { SgpPage } from 'utils/sgp/get-sgp-page';
import { useUiContext } from '../context';
import { UiButton } from '../ui-button';
import { fetchEventData } from 'utils/sgp/fetch-event-data';

const DIALOG_TITLE = 'Championship data JSON';

export const JsonButton: FC = () => {
  const { page, setLoading, setDialogData } = useUiContext();
  const disabled = page !== SgpPage.CHAMPIONSHIP && page !== SgpPage.EVENT;
  const title = disabled
    ? 'Need to be on a championship to get the data JSON'
    : 'Get the championship data JSON';

  const click = useCallback(async () => {
    setLoading('Fetching data...');
    try {
      let request: ReturnType<typeof fetchChampionshipData>;

      if (page === SgpPage.EVENT) {
        // from an event can be also retrieved but it's an extra step
        const data = await fetchEventData();
        if (!data) throw new Error('No event data');
        const eventId = data.getChampionshipId();
        if (!eventId) throw new Error('No championship for this event');
        request = fetchChampionshipData(eventId);
      } else {
        request = fetchChampionshipData();
      }

      const data = await request.data;
      if (!data) throw new Error('No championship data');
      const obj = JSON.parse(data.toJson());
      const msg = JSON.stringify(obj, null, 2);
      setLoading(false);
      setDialogData(DIALOG_TITLE, msg);
    } catch (e) {
      setLoading(false);
      setDialogData(DIALOG_TITLE, 'Error while retrieving the data.');
    }
  }, []);

  return (
    <UiButton disabled={disabled} title={title} onClick={click}>
      J
    </UiButton>
  );
};
