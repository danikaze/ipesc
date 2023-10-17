import { getVisibleTables } from 'utils/sgp/get-visible-table';
import { SgpResultTable } from 'utils/sgp/result-table';

(window as any).ipesc = {
  ...(window as any).ipesc,
  scrapResults,
};

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
