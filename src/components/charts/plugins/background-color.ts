// @ts-ignore
import type { Plugin, ChartType, ChartArea } from 'chart.js';

export type FillStyle = CanvasRenderingContext2D['fillStyle'];
export interface BackgroundColorPluginOptions {
  color?:
    | FillStyle
    | ((
        ctx: CanvasRenderingContext2D,
        chartArea: ChartArea
      ) => CanvasRenderingContext2D['fillStyle']);
}

export const backgroundColorPlugin: Plugin<ChartType, BackgroundColorPluginOptions> = {
  id: 'backgroundColor',
  beforeDraw: (chart, args, options) => {
    if (!options.color) {
      console.warn(`backgroundColor plugin enabled but options.color was not defined`);
      return;
    }

    const { ctx, chartArea } = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = getFillStyle(ctx, chartArea, options.color);
    ctx.fillRect(chartArea.left, chartArea.top, chartArea.width, chartArea.height);
    ctx.restore();
  },
};

function getFillStyle(
  ctx: CanvasRenderingContext2D,
  chartArea: ChartArea,
  color: Required<BackgroundColorPluginOptions>['color']
): FillStyle {
  if (typeof color !== 'function') return color;
  return color(ctx, chartArea);
}
