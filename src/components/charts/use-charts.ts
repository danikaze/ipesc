import { useEffect, useState } from 'react';

// @ts-ignore
type ReactChart = typeof import('react-chartjs-2');
// @ts-ignore
type ChartJS = typeof import('chart.js');

export function useCharts() {
  const [ReactChart, setReactChart] = useState<undefined | ReactChart>(undefined);
  useEffect(() => {
    // dynamic imports don't allow tree-shaking :(
    // and webpack magic comment `webpackExports` doesn't seem to work here...
    Promise.all([import('chart.js'), import('react-chartjs-2')]).then(
      ([ChartJS, ReactChart]) => {
        register(ChartJS);
        setReactChart(ReactChart);
      }
    );
  });

  return ReactChart;
}

function register(ChartJS: ChartJS): void {
  ChartJS.Chart.register(
    ChartJS.LinearScale,
    ChartJS.CategoryScale,
    ChartJS.BarController,
    ChartJS.BarElement,
    ChartJS.Title,
    ChartJS.Legend,
    ChartJS.Tooltip
  );
}
