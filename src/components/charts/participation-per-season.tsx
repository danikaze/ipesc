import { FC, useMemo } from 'react';

import { DataQuery } from 'data/data-query';
import { useFilteredData } from 'components/data-provider';

import { useCharts } from './use-charts';

export interface Props {}

export const ParticipationPerSeasonChart: FC<Props> = () => {
  const { ReactChart } = useCharts();
  const query = useFilteredData();
  const chartData = useMemo(() => prepareData(query), [query]);

  if (!ReactChart || !chartData) return;

  return (
    <ReactChart.Bar
      width='600px'
      height='400px'
      datasetIdKey='entries'
      options={{
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false,
            text: 'Driver participation per season',
          },
        },
      }}
      data={chartData!}
    />
  );
};

function prepareData(query: DataQuery) {
  const { championships } = query.raw;
  const labels = championships.map((c) => c.customName || c.name);
  const datasets = [
    {
      label: 'Active drivers',
      data: championships.map((c) => c.drivers.length),
      borderWidth: 1,
      borderColor: championships.map(
        (c, ci) =>
          `hsl(${Math.round((360 * ci) / championships.length)}deg 100% 30% / 95%)`
      ),
      backgroundColor: championships.map(
        (c, ci) =>
          `hsl(${Math.round((360 * ci) / championships.length)}deg 80% 50% / 70%)`
      ),
    },
    {
      label: 'Inactive drivers',
      data: championships.map(
        (championship) =>
          championship.drivers.length -
          championship.drivers.filter((driver) =>
            query.hasDriverRacedInChampionship(driver.id, championship.id)
          ).length
      ),
      borderWidth: 1,
      borderRadius: 3,
    },
  ];

  return { labels, datasets };
}
