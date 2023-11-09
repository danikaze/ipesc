// @ts-ignore
import type { Plugin, ChartType } from 'chart.js';

export interface BackgroundColorPluginOptions {
  color?: string;
}

export const backgroundColorPlugin: Plugin<ChartType, BackgroundColorPluginOptions> = {
  id: 'backgroundColor',
  beforeDraw: (chart, args, options) => {
    const { ctx, chartArea } = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle =
      options.color ||
      (() => {
        const gradient = ctx.createLinearGradient(
          chartArea.left,
          chartArea.top,
          chartArea.left,
          chartArea.bottom
        );
        const pro = 'rgba(255,0,0,0.1)';
        const silver = 'rgba(255,255,0,0.1)';
        const am = 'rgba(0,255,0,0.1)';
        gradient.addColorStop(0, pro);
        gradient.addColorStop(0.32, pro);
        gradient.addColorStop(0.33, silver);
        gradient.addColorStop(0.65, silver);
        gradient.addColorStop(0.66, am);
        gradient.addColorStop(1, am);
        return gradient;
      })();
    ctx.fillRect(chartArea.left, chartArea.top, chartArea.width, chartArea.height);
    ctx.restore();
  },
};
