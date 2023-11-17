// @ts-ignore
import type { Chart, Plugin, ChartType } from 'chart.js';
import * as debounce from 'debounce';

export type ResponsivePluginOptions = (
  | {
      /**
       * Specify the width of the chart canvas as an absolute number (`500`)
       * or a percentage (`100%`) relative to its parent
       * `chartAreaWidth` cannot be specified at the same time
       */
      width?: number | string;
      chartAreaWidth?: never;
    }
  | {
      width?: never;
      /**
       * Specify the width of the chart area (data) as an absolute number (`500`)
       * or a percentage (`100%`) relative to its parent
       * `width` cannot be specified at the same time
       */
      chartAreaWidth?: number | string;
    }
) &
  (
    | {
        /**
         * Specify the height of the chart canvas as an absolute number (`500`)
         * or a percentage (`100%`) relative to its parent
         * `chartAreaHeight` cannot be specified at the same time
         */
        height?: number | string;
        chartAreaHeight?: never;
      }
    | {
        height?: never;
        /**
         * Specify the height of the chart area (data) as an absolute number (`500`)
         * or a percentage (`100%`) relative to its parent
         * `height` cannot be specified at the same time
         */
        chartAreaHeight?: number | string;
      }
  );

const ERROR_MARGIN = 1;
const N_REGEX = /^(\d+)(%)?$/;
// list of options per chart, so they are available when called from the
// debounced callback on resize event
const chartOptions: Map<Chart, ResponsivePluginOptions> = new Map();
let resizeHandler: (ev: UIEvent) => void;

export const resizeChartPlugin: Plugin<ChartType, ResponsivePluginOptions> = {
  id: 'resizeChart',
  start: (chart, args, options) => {
    validateOptions(chart, options);
    chart.options.maintainAspectRatio = false;
    chart.options.responsive = false;
    chartOptions.set(chart, options);
    if (chartOptions.size === 1) {
      resizeHandler = debounce(() => {
        const args: Readonly<{ cancelable: true }> = { cancelable: true };
        Array.from(chartOptions.entries()).forEach(([chart, options]) => {
          resizeChartPlugin.beforeRender!(chart, args, options);
        });
      }, chart.options.resizeDelay || 0);
      window.addEventListener('resize', resizeHandler);
    }
  },
  stop: (chart) => {
    chartOptions.delete(chart);
    if (chartOptions.size === 0) {
      window.removeEventListener('resize', resizeHandler);
    }
  },
  beforeRender: (chart, args, options) => {
    const { chartArea, canvas } = chart;
    chartOptions.set(chart, options);

    chart.options.maintainAspectRatio = false;
    chart.options.responsive = false;

    const w = getSize(canvas, 'width', options.chartAreaWidth ?? options.width);
    const h = getSize(canvas, 'height', options.chartAreaHeight ?? options.height);

    const targetW = options.chartAreaWidth ? canvas.width - chartArea.width + w : w;
    const targetH = options.chartAreaHeight ? canvas.height - chartArea.height + h : h;

    if (needsChange(targetW - canvas.width, targetH - canvas.height)) {
      chart.resize(targetW, targetH);
    }
  },
};

function needsChange(...deltas: number[]): boolean {
  return deltas.some((d) => Math.abs(d) > ERROR_MARGIN);
}

function getSize(
  canvas: HTMLCanvasElement,
  type: 'width' | 'height',
  size: number | string | undefined
): number {
  if (!size) return canvas[type];
  if (typeof size === 'number') return size;
  const [_, n, pctg] = N_REGEX.exec(size)!;
  if (!pctg) return parseFloat(n);

  const parent = canvas.parentElement!;
  const total = parent.getBoundingClientRect()[type];
  return (parseFloat(n) * total) / 100;
}

function validateOptions(chart: Chart, options: ResponsivePluginOptions = {}) {
  if (options.width !== undefined && options.chartAreaWidth !== undefined) {
    throw new Error(
      'Only one option between "width" and "chartAreaWidth" can be specified at the same time.'
    );
  }
  if (options.height !== undefined && options.chartAreaHeight !== undefined) {
    throw new Error(
      'Only one option between "height" and "chartAreaHeight" can be specified at the same time.'
    );
  }

  if (chart.options.maintainAspectRatio) {
    console.warn('options.maintainAspectRatio will be set to false');
  }
  if (chart.options.responsive) {
    console.warn('options.responsive will be set to false');
  }

  const w = options.width ?? options.chartAreaWidth;
  if (typeof w === 'string' && !N_REGEX.test(w)) {
    throw new Error(
      `${
        options.width !== undefined ? 'width' : 'chartAreaWidth'
      } is not a valid value (${w})`
    );
  }
  const h = options.height ?? options.chartAreaHeight;
  if (typeof h === 'string' && !N_REGEX.test(h)) {
    throw new Error(
      `${
        options.height !== undefined ? 'height' : 'chartAreaHeight'
      } is not a valid value (${h})`
    );
  }
}
