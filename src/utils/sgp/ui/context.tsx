import { createContext, useContext } from 'react';
import { SgpPage } from '../get-sgp-page';
import { DialogData } from '.';
import { SgpEventApiData } from '../event-api-data';

export interface UiContextData {
  page: SgpPage | undefined;
  openPenaltyDialog: (data: SgpEventApiData | undefined) => void;
  closePenaltyDialog: () => void;
  eventData: SgpEventApiData | undefined;
  dialogMessageData: DialogData | undefined;
  setDialogData(nil: undefined): void;
  setDialogData(title: string, msg: string): void;
  setLoading: (isLoading: string | boolean) => void;
}

const uiContext = createContext<UiContextData | undefined>(undefined);
uiContext.displayName = 'UiContext';
export const UiContext = uiContext.Provider;

export function useUiContext(): UiContextData {
  const ctx = useContext(uiContext);
  if (!ctx) {
    throw new Error('No UiContext found');
  }

  return ctx;
}
