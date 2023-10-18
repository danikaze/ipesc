import { SgpEventApiData } from './sgp/event-api-data';
import { SgpCategory, SgpEventType } from './sgp/types';
import { msToTime } from './time';

export function formatResultsMessageForDiscord(data: SgpEventApiData): string {
  const title = `⭐ ${data.getChampionshipName()} ⭐`;
  const titleLength = Math.max(title.length, data.getEventName()?.length || 0);
  return [
    '',
    center(title, titleLength),
    center(data.getEventName(), titleLength),
    '',
    getCategoryResults(':red_square: PRO', data, SgpCategory.PRO),
    getCategoryResults(':yellow_square: SILVER', data, SgpCategory.SILVER),
    getCategoryResults(':green_square: AM', data, SgpCategory.AM),
    '_As always these results are provisional and subject to penalty allocation_',
  ].join('\n');
}

function getCategoryResults(
  title: string,
  data: SgpEventApiData,
  category: SgpCategory
): string {
  const nRaces = data.getNumberOfRaces();

  if (nRaces === 1) {
    return [`**${title}**`, '', getNames(data, category, 0), ''].join('\n');
  }

  const results = [];
  for (let r = 0; r < nRaces; r++) {
    results.push(['', `**R${r + 1}**`, getNames(data, category, r)].join('\n'));
  }
  return [`**${title}**`, results.join('\n'), ''].join('\n');
}

function getNames(data: SgpEventApiData, category: SgpCategory, index: number): string {
  const categoryData = data
    .getResults(SgpEventType.RACE, index)
    .results.filter((data) => category === data.category);

  categoryData.sort((a, b) => (a.position || Infinity) - (b.position || Infinity));
  const podium = [
    `> 🥇 | ${categoryData[0].participant.name}`,
    `> 🥈 | ${categoryData[1].participant.name}`,
    `> 🥉 | ${categoryData[2].participant.name}`,
  ];

  categoryData.sort(
    (a, b) => (a.bestCleanLapTime || Infinity) - (b.bestCleanLapTime || Infinity)
  );
  const bestLap = `> 🏎️ | ${categoryData[0].participant.name} 【${msToTime(
    categoryData[0].bestCleanLapTime
  )}】`;

  return [...podium, bestLap].join('\n');
}

function center(text: string, size: number, char = ' '): string {
  return text
    .padStart(Math.floor(text.length + (size - text.length) / 2), char)
    .padEnd(size, char);
}
