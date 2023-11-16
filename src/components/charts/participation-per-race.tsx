import { FC, useMemo } from 'react';

import { DataQuery } from 'data/data-query';
import { Event, Championship } from 'data/types';
import { useFilteredData } from 'components/data-provider';

import { useCharts } from './use-charts';

export interface Props {}

export const ParticipationPerRaceChart: FC<Props> = () => {
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
            text: 'Driver participation per race',
          },
        },
      }}
      data={chartData}
    />
  );
};

function prepareData(query: DataQuery) {
  const events = query.raw.championships.reduce(
    (labels, c, ci) => {
      c.events.forEach((e) => labels.push([e, c, ci]));
      return labels;
    },
    [] as [Event, Championship, number][]
  );

  const labels = events.map(([e]) => e.name);
  const eventDrivers = events.map(([e]) => query.getDriverList(e));

  const datasets = [
    {
      label: 'Active drivers',
      data: eventDrivers.map(({ active }) => active.length),
      borderWidth: 1,
      borderColor: events.map(
        ([e, c, ci]) =>
          `hsl(${Math.round(
            (360 * ci) / query.raw.championships.length
          )}deg 100% 30% / 95%)`
      ),
      backgroundColor: events.map(
        ([e, c, ci]) =>
          `hsl(${Math.round(
            (360 * ci) / query.raw.championships.length
          )}deg 80% 50% / 70%)`
      ),
    },
    {
      label: 'Inactive drivers',
      // hidden: true,
      data: eventDrivers.map(({ inactive }) => inactive.length),
      borderWidth: 1,
      borderRadius: 3,
    },
  ];

  return { labels, datasets };
}
