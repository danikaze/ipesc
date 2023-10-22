import { FC, useMemo } from 'react';
import { ProcessedData, Event, Championship } from 'data/types';
import { useCharts } from './use-charts';

export interface Props {
  data: ProcessedData;
}

export const ParticipationPerRaceChart: FC<Props> = ({ data }) => {
  const ReactChart = useCharts();
  const chartData = useMemo(() => prepareData(data), [data]);

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

function prepareData(data: ProcessedData) {
  const events = data.championships.reduce(
    (labels, c, ci) => {
      c.events.forEach((e) => labels.push([e, c, ci]));
      return labels;
    },
    [] as [Event, Championship, number][]
  );

  const labels = events.map(([e]) => e.name);

  const datasets = [
    {
      label: 'Active drivers',
      data: events.map(([e]) => e.activeDrivers.length),
      borderWidth: 1,
      borderColor: events.map(
        ([e, c, ci]) =>
          `hsl(${Math.round((360 * ci) / data.championships.length)}deg 100% 30% / 95%)`
      ),
      backgroundColor: events.map(
        ([e, c, ci]) =>
          `hsl(${Math.round((360 * ci) / data.championships.length)}deg 80% 50% / 70%)`
      ),
    },
    {
      label: 'Inactive drivers',
      // hidden: true,
      data: events.map(([e, c]) => e.inactiveDrivers.length),
      borderWidth: 1,
      borderRadius: 3,
    },
  ];

  return { labels, datasets };
}
