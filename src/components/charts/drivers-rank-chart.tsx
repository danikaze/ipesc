import { FC, useMemo } from 'react';

import { useFilteredData } from 'components/data-provider';
import { DataQuery } from 'data/data-query';
import { AccVersion, Driver, Game, LapField, TrackData } from 'data/types';
import { getAccVersionFromTime } from 'utils/acc-version';
import { cluster } from 'utils/cluster';
import { formatRatioAsPctg } from 'utils/format-data';
import { getPctgColor } from 'utils/get-color';
import { msToTime } from 'utils/time';
import { LapTimeAsMs } from 'utils/types';

import {
  BackgroundColorPluginOptions,
  backgroundColorPlugin,
} from './plugins/background-color';
import { resizeChartPlugin } from './plugins/resize-chart';
import { useCharts } from './use-charts';

export interface Props {
  lapField?: LapField;
  minEvents?: number;
  maxPctg?: number;
}

type EventItem = {
  game?: Game;
  startTime: number;
  version?: AccVersion;
  name: TrackData['name'];
  lapTime: LapTimeAsMs;
  pctg: number;
  retired: boolean;
  wet: boolean;
};

const HEIGHT_PER_BAR_PX = 20;
const DEFAULT_CHART_OPTIONS: Required<Props> = {
  lapField: 'bestCleanLapTime',
  minEvents: 1,
  maxPctg: 2,
};
const FIELDS: Record<
  Required<Props>['lapField'],
  Record<'title' | 'subtitle', string>
> = {
  bestCleanLapTime: {
    title: 'Drivers rank based on fastest clean race lap averages',
    subtitle:
      'Results shown based on percentages from the fastest clean race lap registered for the event',
  },
  avgCleanLapTime: {
    title: 'Drivers rank based on average clean race lap averages',
    subtitle: 'This might include starting laps, etc.',
  },
  averageLapTime: {
    title: 'Drivers rank based on average race lap averages',
    subtitle: 'This might include starting laps, etc.',
  },
};

export const DriversRankChart: FC<Props> = (props) => {
  const { ReactChart } = useCharts();
  const query = useFilteredData();

  const chartDataOptions = useMemo<Required<Props>>(
    () =>
      ({
        ...DEFAULT_CHART_OPTIONS,
        ...props,
      }) as Required<Props>,
    [props]
  );
  const chartData = useMemo(
    () => prepareData(query, chartDataOptions),
    [query, chartDataOptions]
  );

  if (!ReactChart || !chartData) return null;
  if (!chartData.labels.length) return null;

  return (
    <ReactChart.Bar
      datasetIdKey='drivers-rank'
      options={{
        responsive: false,
        maintainAspectRatio: false,
        indexAxis: 'y',
        layout: {
          padding: { right: 20 },
        },
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
            text: FIELDS[chartDataOptions.lapField].title,
          },
          subtitle: {
            display: true,
            position: 'top',
            text: FIELDS[chartDataOptions.lapField].subtitle,
            padding: {
              bottom: 10,
            },
          },
          tooltip: {
            callbacks: {
              title: ([{ dataIndex, label }]) => {
                return `P${dataIndex + 1}. ${label}`;
              },
              label: ({ dataIndex }) => {
                const data = chartData.driverData[dataIndex];
                return formatRatioAsPctg(data.pctg);
              },
              footer: ([{ dataIndex }]) => {
                const data = chartData.driverData[dataIndex];
                return data.eventList.map(
                  ({ game, version, name, lapTime: avgLapTime, pctg, retired, wet }) => {
                    const prefix = game
                      ? `[${game}${version ? `/${version}` : ''}] `
                      : undefined;
                    const flags = [retired && 'R', wet && 'W'].filter(Boolean).join('');
                    return `${prefix ? `${prefix}` : ''}${name}: ${msToTime(
                      avgLapTime
                    )} (${formatRatioAsPctg(pctg)}) ${flags}`;
                  }
                );
              },
            },
          },
          ...{
            backgroundColor: getBackgroundOptions(chartData.datasets[0].data),
          },
          ...{
            resizeChart: {
              width: '100%',
              chartAreaHeight: chartData.height,
            },
          },
        },
      }}
      data={chartData}
      plugins={[backgroundColorPlugin, resizeChartPlugin]}
    />
  );
};

function prepareData(data: DataQuery, { lapField, maxPctg, minEvents }: Required<Props>) {
  const driverData = data.raw.drivers
    .map((driver) => getDriverAveragePctg(data, driver, lapField))
    .filter((entry) => {
      if (isNaN(entry.pctg)) {
        console.log(`Filtered out: No pctg`, entry);
        return false;
      }
      if (entry.pctg > maxPctg) {
        console.log(`Filtered out: Slow (${entry.pctg} > ${maxPctg})`, entry);
        return false;
      }
      if (entry.eventList.length < minEvents) {
        console.log(
          `Filtered out: Not enough events: ${entry.eventList.length} < ${minEvents}`,
          entry
        );
        return false;
      }
      return true;
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

function getBackgroundOptions(data: number[]): BackgroundColorPluginOptions {
  const GRAD_RADIUS = 0.005;

  const clusters = cluster<number>(3, data, (x) => x);
  const p0 = clusters[0].length / data.length;
  const p1 = (data.length - clusters[1].length) / data.length;

  const pro = 'rgba(255,0,0,0.1)';
  const silver = 'rgba(255,255,0,0.1)';
  const am = 'rgba(0,255,0,0.1)';

  return {
    color: (ctx, chartArea) => {
      const gradient = ctx.createLinearGradient(
        chartArea.left,
        chartArea.top,
        chartArea.left,
        chartArea.bottom
      );

      gradient.addColorStop(0, pro);
      gradient.addColorStop(p0 - GRAD_RADIUS, pro);
      gradient.addColorStop(p0 + GRAD_RADIUS, silver);
      gradient.addColorStop(p1 - GRAD_RADIUS, silver);
      gradient.addColorStop(p1 + GRAD_RADIUS, am);
      gradient.addColorStop(1, am);

      return gradient;
    },
  };
}

/**
 * From every event of the passed data, search events with the driver and get
 * the percentage relative to the track best time on that race
 */
function getDriverAveragePctg(
  query: DataQuery,
  driver: Driver,
  lapField: Required<Props>['lapField']
) {
  // list of events where the driver has participated
  const events = query.raw.championships.flatMap((championship) =>
    championship.events.flatMap((event) => ({
      name: event.name,
      game: championship.game,
      version: getAccVersionFromTime(championship.game, event.startTime),
      startTime: event.startTime,
      id: event.trackId,
      results: event.results.filter(
        ({ type, results }) =>
          type === 'race' &&
          results.find((result) => result.driverId === driver.id)?.[lapField]
      ),
    }))
  );

  // sum of the best times for the tracks this driver raced
  let totalBest = 0;
  // sum of the driver best averages for the tracks
  let driverAverage = 0;

  const eventList = events
    .flatMap((event) =>
      event.results.map(({ wet, results }) => {
        const driverResult = results.find((result) => result.driverId === driver.id);
        const driverLapTime = driverResult?.[lapField];
        if (!driverLapTime) return;
        const trackBest = query.getEventRecords(event, lapField).race;
        if (!trackBest) return;

        const pctg = driverLapTime / trackBest.lapTime;
        driverAverage += driverLapTime;
        totalBest += trackBest.lapTime;

        const item: EventItem = {
          game: event.game,
          startTime: event.startTime,
          version: event.version,
          name: event.name,
          lapTime: driverLapTime,
          pctg,
          retired: !!driverResult.retired,
          wet: !!wet,
        };

        return item;
      })
    )
    .filter(Boolean) as EventItem[];

  eventList.sort((a, b) => a.startTime - b.startTime);

  return {
    driver,
    eventList,
    pctg: driverAverage / totalBest,
  };
}
