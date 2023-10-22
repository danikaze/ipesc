import { FC, useMemo } from 'react';
import { ProcessedData } from 'data/types';
import { useCharts } from './use-charts';

export interface Props {
  data: ProcessedData;
}

export const ParticipationPerSeasonChart: FC<Props> = ({ data }) => {
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
            text: 'Driver participation per season',
          },
        },
      }}
      data={chartData!}
    />
  );
};

function prepareData(data: ProcessedData) {
  const labels = data.championships.map((c) => c.customName || c.name);
  const datasets = [
    {
      label: 'Active drivers',
      data: data.championships.map((c) => c.drivers.length),
      borderWidth: 1,
      borderColor: data.championships.map(
        (c, ci) =>
          `hsl(${Math.round((360 * ci) / data.championships.length)}deg 100% 30% / 95%)`
      ),
      backgroundColor: data.championships.map(
        (c, ci) =>
          `hsl(${Math.round((360 * ci) / data.championships.length)}deg 80% 50% / 70%)`
      ),
    },
    {
      label: 'Inactive drivers',
      data: data.championships.map(
        (c) => c.drivers.length - c.drivers.filter((d) => d.raced).length
      ),
      borderWidth: 1,
      borderRadius: 3,
    },
  ];

  return { labels, datasets };
}
