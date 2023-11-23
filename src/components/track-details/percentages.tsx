import { FC, ReactNode, useMemo } from 'react';
import { Tr, Th, Td, Table, Thead, Tbody } from '@chakra-ui/react';

import { Category, EventType } from 'data/types';
import { getPctgColor } from 'utils/get-color';
import { msToTime } from 'utils/time';

import { CategoryBests } from '.';
import { CategoryBadge } from './category-badge';

export interface Props extends CategoryBests {
  max: number;
}

type CategoryTimes = Record<
  Category,
  ({
    // numeric (unformatted) percentage as 100, 101...
    pctg: number;
  } & Partial<
    Record<
      EventType,
      // formatted lap times or '---' when the time is not up to this %
      // undefined means there's no time available = no render
      string
    >
  >)[]
>;

export const Percentages: FC<Props> = ({ max, quali, race }) => {
  const times = useMemo(() => calcTimesPerCat(max, quali, race), [max, quali, race]);

  return (
    <Table
      size='sm'
      width='min-content'
      height='min-content'
      backgroundColor='#f1f1f1'
      borderRadius={5}
      mb={4}
    >
      <Thead>
        <Tr>
          <Th></Th>
          {quali && <Th textAlign='center'>Quali</Th>}
          {race && <Th textAlign='center'>Race</Th>}
        </Tr>
      </Thead>
      <Tbody>
        {renderCategoryTimes(times, Category.PRO)}
        {renderCategoryTimes(times, Category.SILVER)}
        {renderCategoryTimes(times, Category.AM)}
      </Tbody>
    </Table>
  );
};

function renderCategoryTimes(times: CategoryTimes, category: Category) {
  const categoryTimes = times[category];
  const rows: ReactNode[] = [
    <Tr key={category}>
      <Th colSpan={3} textAlign='center' px={0}>
        <CategoryBadge size='xs' width='100%' category={category} />
      </Th>
    </Tr>,
  ];

  for (const { pctg, quali, race } of categoryTimes) {
    const pctgColor = getPctgColor(pctg);
    const cells = [
      <Th key='p' borderLeft={`3px solid ${pctgColor}`}>{`${pctg}%`}</Th>,
      quali && (
        <Td key='q' textAlign='center'>
          {quali}
        </Td>
      ),
      race && (
        <Td key='r' textAlign='center'>
          {race}
        </Td>
      ),
    ];
    rows.push(<Tr key={pctg}>{cells}</Tr>);
  }

  return rows;
}

function calcTimesPerCat(
  maxPctg: number,
  quali: Record<Category, number> | undefined,
  race: Record<Category, number> | undefined
): CategoryTimes {
  const res: CategoryTimes = {
    [Category.PRO]: [],
    [Category.SILVER]: [],
    [Category.AM]: [],
  };

  for (let p = 100; p <= maxPctg; p++) {
    addTime(res, p, quali, 'quali');
    addTime(res, p, race, 'race');
  }

  // make sure unbalanced times have an entry as well (as '---')
  Object.values(res).forEach((cat) =>
    cat.forEach((entry) => {
      if (quali && !entry.quali) {
        entry.quali = '---';
      }
      if (race && !entry.race) {
        entry.race = '---';
      }
    })
  );

  return res;
}

function addTime(
  res: CategoryTimes,
  pctg: number,
  records: Record<Category, number> | undefined,
  type: EventType
): void {
  const bestTime = records?.[Category.PRO];
  if (!records || !bestTime) return;

  const time = (bestTime * pctg) / 100;
  const cat = getCategory(records, pctg);

  const resCat = res[cat];
  const item = resCat.find((entry) => pctg === entry.pctg);
  if (item) {
    item[type] = msToTime(time);
  } else {
    resCat.push({ pctg, [type]: msToTime(time) });
  }
}

function getCategory(categoryTimes: Record<Category, number>, pctg: number): Category;
function getCategory(
  categoryTimes: Record<Category, number> | undefined,
  pctg: number
): Category | undefined;
function getCategory(
  categoryTimes: Record<Category, number> | undefined,
  pctg: number
): Category | undefined {
  if (!categoryTimes) return;

  if (pctg < (100 * categoryTimes[Category.SILVER]) / categoryTimes[Category.PRO]) {
    return Category.PRO;
  }
  if (pctg < (100 * categoryTimes[Category.AM]) / categoryTimes[Category.PRO]) {
    return Category.SILVER;
  }

  return Category.AM;
}
