import { version } from '../../package.json';
import { formatResultsMessageForDiscord } from 'utils/format-results-message-for-discord';
import { getVisibleTables } from 'utils/sgp/get-visible-table';
import { SgpResultTable } from 'utils/sgp/result-table';

(window as any).ipesc = {
  ...(window as any).ipesc,
  version,
  scrapResults,
  getResultsForDiscord,
};

printEnabledMsg();

function scrapResults() {
  const tables = getVisibleTables();
  if (!tables || tables.length > 1) {
    throw new Error(
      `Unknown HTML. Make sure you have selected one of the following tabs: RACE | RACE 1 | RACE 2 | QUALIFY | PRACTICE.`
    );
  }

  const table = new SgpResultTable(tables[0]);
  return table.scrapResults();
}

function getResultsForDiscord() {
  const results = scrapResults();
  const msg = formatResultsMessageForDiscord(results);
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
