// ==UserScript==
// @name         Simracing GP for IPESC
// @namespace    ipesc.danikaze
// @version      0.2.0
// @description  Set of utilities available on DevTools for IPESC racing community
// @author       danikaze
// @source       https://github.com/danikaze/ipesc
// @updateURL    https://gist.github.com/danikaze/9154b3b79eb2c605687c78f4991841fd/raw/ipesc-helpers.user.js
// @downloadURL  https://gist.github.com/danikaze/9154b3b79eb2c605687c78f4991841fd/raw/ipesc-helpers.user.js
// @match        https://app.simracing.gp/*
// @icon         https://app.simracing.gp/favicon.ico
// @run-at       document-end
// @noframes
// @grant        unsafeWindow
// ==/UserScript==

import { version } from '../../package.json';
import { fetchChampionshipData } from 'utils/sgp/fetch-championship-data';
import { formatResultsMessageForDiscord } from 'utils/format-results-message-for-discord';
import { fetchEventData } from 'utils/sgp/fetch-event-data';
import { clearApiCache } from 'utils/sgp/call-api';
import { injectUi } from '../utils/sgp/ui';

const helpers = {
  version,
  clearApiCache,
  fetchEventData,
  fetchChampionshipData,
  getResultsForDiscord,
  injectUi,
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
injectUi();

async function getResultsForDiscord(eventId?: string): Promise<string> {
  const eventData = await fetchEventData(eventId);
  if (!eventData) {
    console.warn(`Couldn't retrieve the results for the event`);
    throw new Error(`Couldn't retrieve the results for the event`);
  }
  const msg = formatResultsMessageForDiscord(eventData);
  console.log(msg);
  return msg;
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
