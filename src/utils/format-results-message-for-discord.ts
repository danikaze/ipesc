import { SgpEventApiData } from './sgp/event-api-data';
import { SgpCategory, SgpEventType } from './sgp/types';
import { msToTime } from './time';

export function formatResultsMessageForDiscord(data: SgpEventApiData): string {
  const title = `⭐ ${data.getChampionshipName()} ⭐`;
  const titleLength = Math.max(title.length, data.getEventName()?.length || 0);
  const categories = data.getCategoryList();
  const results: string[] = [];

  if (!categories || categories.length === 0) {
    results.push(getGlobalResults(data));
  } else {
    if (categories.includes(SgpCategory.PRO)) {
      results.push(getCategoryResults(':red_square: PRO', data, SgpCategory.PRO));
    }
    if (categories.includes(SgpCategory.SILVER)) {
      results.push(getCategoryResults(':red_square: PRO', data, SgpCategory.SILVER));
    }
    if (categories.includes(SgpCategory.AM)) {
      results.push(getCategoryResults(':green_square: AM', data, SgpCategory.AM));
    }
  }

  return [
    '',
    center(title, titleLength),
    center(data.getEventName(), titleLength),
    '',
    ...results,
    '_As always these results are provisional and subject to penalty allocation_',
  ].join('\n');
}

function getGlobalResults(data: SgpEventApiData): string {
  const nRaces = data.getNumberOfRaces();

  if (nRaces === 1) {
    return [getNames(data, 0), ''].join('\n');
  }

  const results = [];
  for (let r = 0; r < nRaces; r++) {
    results.push([`**R${r + 1}**`, getNames(data, r), ''].join('\n'));
  }
  return [results.join('\n')].join('\n');
}

function getCategoryResults(
  title: string,
  data: SgpEventApiData,
  category: SgpCategory
): string {
  const nRaces = data.getNumberOfRaces();

  if (nRaces === 1) {
    return [`**${title}**`, '', getNames(data, 0, category), ''].join('\n');
  }

  const results = [];
  for (let r = 0; r < nRaces; r++) {
    results.push(['', `**R${r + 1}**`, getNames(data, r, category)].join('\n'));
  }
  return [`**${title}**`, results.join('\n'), ''].join('\n');
}

function getNames(data: SgpEventApiData, index: number, category?: SgpCategory): string {
  const categoryData = data
    .getResults(SgpEventType.RACE, index)
    .results.filter((data) => !category || category === data.category);

  categoryData.sort((a, b) => (a.position || Infinity) - (b.position || Infinity));
  const results = [
    `> 🥇 | ${categoryData[0].participant.name}`,
    `> 🥈 | ${categoryData[1].participant.name}`,
    `> 🥉 | ${categoryData[2].participant.name}`,
  ];

  categoryData.sort(
    (a, b) => (a.bestCleanLapTime || Infinity) - (b.bestCleanLapTime || Infinity)
  );
  if (categoryData[0].bestCleanLapTime) {
    results.push(
      `> 🏎️ | ${categoryData[0].participant.name} 【${msToTime(
        categoryData[0].bestCleanLapTime
      )}】`
    );
  }
  return results.join('\n');
}

function center(text: string, size: number, char = ' '): string {
  return text
    .padStart(Math.floor(text.length + (size - text.length) / 2), char)
    .padEnd(size, char);
}
