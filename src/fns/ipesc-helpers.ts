import { fetchChampionshipData } from 'utils/sgp/fetch-championship-data';
import { version } from '../../package.json';
import { formatResultsMessageForDiscord } from 'utils/format-results-message-for-discord';
import { fetchEventData } from 'utils/sgp/fetch-event-data';
import { clearApiCache } from 'utils/sgp/call-api';

const helpers = {
  version,
  clearApiCache,
  fetchEventData,
  fetchChampionshipData,
  getResultsForDiscord,
};

// register the `ipesc` helpers as a global namespace in `window`
(window as any).ipesc = {
  ...(window as any).ipesc,
  ...helpers,
};

// register them also in `unsafeWindow` in case this is a Tampermonkey script
declare const unsafeWindow: any;
if (typeof unsafeWindow !== 'undefined') {
  unsafeWindow.ipesc = {
    ...unsafeWindow.ipesc,
    ...helpers,
  };
}

printEnabledMsg();

async function getResultsForDiscord(eventId?: string) {
  const eventData = await fetchEventData(eventId);
  if (!eventData) {
    console.warn(`Couldn't retrieve the results for the event`);
    return;
  }
  const msg = formatResultsMessageForDiscord(eventData);
  console.log(msg);
}

function printEnabledMsg() {
  const reset = 'color: blue;';
  const code =
    'font-family: monospace; font-weight: bold; padding: 1px 3px; background: grey; color: orange;';
  const msg = [
    '%c                                                      ',
    '',
    '%c  I%cPESC%c utilities enabled!',
    '  Type %cipesc%c to see a list of available functions.',
    '  i.e. %cipesc.getResultsForDiscord()%c to use it.',
    '',
    '  https://danikaze.github.io/ipesc/',
    '',
    '%c                                                      ',
  ].join('\n');
  console.log(
    msg,
    'border-bottom: 8px solid orange',
    'font-weight: bold; color:orange',
    'font-weight: bold; color:black',
    reset,
    code,
    reset,
    code,
    reset,
    'border-top: 8px solid orange'
  );
}