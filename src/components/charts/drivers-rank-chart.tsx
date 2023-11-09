import { FC, useMemo } from 'react';

import { Driver, ProcessedData, TrackData } from 'data/types';
import { formatRatioAsPctg } from 'utils/format-data';
import { getPctgColor } from 'utils/get-pctg-color';
import { msToTime } from 'utils/time';
import { LapTimeAsMs } from 'utils/types';

import { useCharts } from './use-charts';
import { backgroundColorPlugin } from './plugins/background-color';

export interface Props {
  data: ProcessedData;
  minEvents?: number;
  maxPctg?: number;
}

const HEIGHT_PER_BAR_PX = 15;
const DEFAULT_FILTER: Required<Omit<Props, 'data'>> = {
  minEvents: 1,
  maxPctg: 2,
};

export const DriversRankChart: FC<Props> = ({ data, ...filter }) => {
  const fullFilter = { ...DEFAULT_FILTER, ...filter };
  const ReactChart = useCharts();
  const chartData = useMemo(() => prepareData(data, fullFilter), [data]);

  if (!ReactChart || !chartData) return null;

  return (
    <ReactChart.Bar
      width='600px'
      height={chartData.height}
      datasetIdKey='entries'
      options={{
        indexAxis: 'y',
        responsive: true,
        scales: {
          x: {
            max: 1,
            min: chartData.minPctg,
            ticks: {
              callback: (value) => formatRatioAsPctg(1 / Number(value), 0),
            },
            afterBuildTicks(axis) {
              axis.ticks = [];
              const max = Math.round(100 / chartData.minPctg);
              const delta = max > 110 ? 2 : 1; // grid lines every ${delta}%

              for (let pctg = max; pctg >= 100; pctg -= delta) {
                axis.ticks.unshift({
                  value: 100 / pctg,
                  label: formatRatioAsPctg(pctg, 0),
                });
              }
            },
          },
          y: {},
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Drivers rank based on clean lap averages',
          },
          subtitle: {
            display: true,
            position: 'top',
            text: 'Results shown based on percentages from the best clean race lap',
            padding: {
              bottom: 10,
            },
          },
          tooltip: {
            callbacks: {
              title: ([{ dataIndex, label }]) => {
                return `P${dataIndex + 1}. ${label}`;
              },
              label: ({ dataIndex, raw }) => {
                const data = chartData.driverData[dataIndex];
                return formatRatioAsPctg(data.pctg);
              },
              footer: ([{ dataIndex }]) => {
                const data = chartData.driverData[dataIndex];
                return data.eventList.map(
                  ({ name, avgLapTime, pctg }) =>
                    `${name}: ${msToTime(avgLapTime)} (${formatRatioAsPctg(pctg)})`
                );
              },
            },
          },
        },
      }}
      data={chartData}
      plugins={[backgroundColorPlugin]}
    />
  );
};

function prepareData(data: ProcessedData, { maxPctg, minEvents }: typeof DEFAULT_FILTER) {
  const driverData = data.drivers
    .map((driver) => getDriverAveragePctg(data, driver))
    .filter(({ pctg, eventList }) => {
      return !isNaN(pctg) && pctg < maxPctg && eventList.length >= minEvents;
    });
  driverData.sort((a, b) => a.pctg - b.pctg);

  const labels = driverData.map(({ driver }) => driver.name);
  const datasets = [
    {
      label: 'IPESC Drivers',
      data: driverData.map(({ pctg }) => 1 / pctg),
      borderWidth: 1,
      borderRadius: 3,
      backgroundColor: driverData.map(({ pctg }) => getPctgColor(pctg * 100, true)),
    },
  ];

  const height = HEIGHT_PER_BAR_PX * labels.length;

  const slowest = driverData.reduce((min, data) => Math.min(min, 1 / data.pctg), 1);
  const minPctg =
    100 / (Math.ceil(100 / slowest) + (Math.ceil(100 / slowest) % 2 ? 1 : 2));

  return {
    labels,
    datasets,
    driverData,
    height,
    minPctg,
  };
}

/**
 * From every event of the passed data, search events with the driver and get
 * the percentage relative to the track best time
 * Driver time is based on his best average clean race lap time for that track
 */
function getDriverAveragePctg(data: ProcessedData, driver: Driver) {
  const tracks = data.tracks.filter((track) =>
    track.best.race.find((result) => result.driverId === driver.id)
  );

  // list of events considered for the driver
  let eventList: { name: TrackData['name']; avgLapTime: LapTimeAsMs; pctg: number }[] =
    [];
  // sum of the best times for the tracks this driver raced
  let totalBest = 0;
  // sum of the driver best averages for the tracks
  let driverAverage = 0;

  tracks.forEach((event) => {
    const trackBest = data.tracks.find(({ id }) => id === event.id)!.best.race[0].lapTime;
    const driverBest = event.best.race.find(
      (result) => result.driverId === driver.id
    )!.lapTime;

    totalBest += trackBest;
    driverAverage += driverBest;

    eventList.push({
      name: event.name,
      avgLapTime: driverBest,
      pctg: driverBest / trackBest,
    });
  });

  eventList.sort((a, b) => a.name.localeCompare(b.name));

  return {
    driver,
    eventList,
    pctg: driverAverage / totalBest,
  };
}
