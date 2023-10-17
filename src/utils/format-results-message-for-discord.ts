import { ExpandedSgpRaceResult, expandRaceResults } from './expand-results';
import { SgpCategory, SgpRaceResult } from './sgp/result-table';

export function formatResultsMessageForDiscord(results: SgpRaceResult[]): string {
  const expandedResults = results.map(expandRaceResults);
  return [
    getCategoryResults(':red_square: PRO', expandedResults, SgpCategory.PRO),
    getCategoryResults(':yellow_square: SILVER', expandedResults, SgpCategory.SILVER),
    getCategoryResults(':green_square: AM', expandedResults, SgpCategory.AM),
    '_As always these results are provisional and subject to penalty allocation_',
  ].join('\n');
}

function getCategoryResults(
  title: string,
  results: ExpandedSgpRaceResult[],
  category: SgpCategory
): string {
  const categoryData = results.filter((data) => category === data.category);

  categoryData.sort((a, b) => (a.pos || Infinity) - (b.pos || Infinity));
  const podium = [
    `> 🥇 | ${categoryData[0].driver}`,
    `> 🥈 | ${categoryData[1].driver}`,
    `> 🥉 | ${categoryData[2].driver}`,
  ];

  categoryData.sort((a, b) => (a.bestLapMs || Infinity) - (b.bestLapMs || Infinity));
  const bestLap = `> 🏎️ | ${categoryData[0].driver} 【${categoryData[0].bestLap}】`;

  return [`**${title}**`, '', ...podium, bestLap, ''].join('\n');
}
