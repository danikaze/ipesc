import { FC, useCallback } from 'react';
import { SgpPage } from 'utils/sgp/get-sgp-page';
import { useUiContext } from '../context';
import { UiButton } from '../ui-button';
import { fetchEventData } from 'utils/sgp/fetch-event-data';

export const PenaltyButton: FC = () => {
  const { page, setLoading, openPenaltyDialog } = useUiContext();
  const disabled = page !== SgpPage.EVENT;
  const title = disabled
    ? 'Need to be on a finished event to manage Penalties'
    : 'Open Penalties Dialog';

  const click = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchEventData();
      openPenaltyDialog(data);
    } catch (e) {
      openPenaltyDialog(undefined);
    }
    setLoading(false);
  }, []);

  return (
    <UiButton disabled={disabled} title={title} onClick={click}>
      P
    </UiButton>
  );
};
