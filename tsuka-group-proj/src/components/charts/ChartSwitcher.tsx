import { useEffect, useState } from 'react';
import { ColorType, createChart, IChartApi, ISeriesApi, SeriesDataItemTypeMap, Time } from 'lightweight-charts';

type IntervalType = '1D' | '1W' | '1M' | '1Y';
type SeriesData = { time: Time, value: number }[];

interface ChartSwitcherProps {
  intervals: IntervalType[];
  seriesesData: Map<IntervalType, SeriesData>;
}

const ChartSwitcher: React.FC<ChartSwitcherProps> = ({ intervals, seriesesData }) => {
  const [chart, setChart] = useState<IChartApi | null>(null);
  const [areaSeries, setAreaSeries] = useState<ISeriesApi<'Area'> | null>(null);
  const [activeInterval, setActiveInterval] = useState<IntervalType>(intervals[0]);

  useEffect(() => {
    const chart = createChart(document.body, {
      width: 600,
      height: 300,
      layout: {
        background: {
          type: ColorType.Solid,
          color: '#000000',
        },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          color: 'rgba(42, 46, 57, 0.5)',
        },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
      },
      crosshair: {
        horzLine: {
          visible: false,
        },
      },
    });

    setChart(chart);
  }, []);

  useEffect(() => {
    if (chart) {
      if (areaSeries) {
        chart.removeSeries(areaSeries);
      }

      const newAreaSeries = chart.addAreaSeries({
        topColor: 'rgba(76, 175, 80, 0.56)',
        bottomColor: 'rgba(76, 175, 80, 0.04)',
        lineColor: 'rgba(76, 175, 80, 1)',
        lineWidth: 2,
      });

      newAreaSeries.setData(seriesesData.get(activeInterval) as SeriesDataItemTypeMap['Area'][]);
      setAreaSeries(newAreaSeries);
    }
  }, [chart, activeInterval]);

  const onIntervalClick = (interval: IntervalType) => {
    setActiveInterval(interval);
  };

  return (
    <div>
      <div className="flex">
        {intervals.map((interval) => (
          <button
            key={interval}
            onClick={() => onIntervalClick(interval)}
            className={`switcher-item ${
              interval === activeInterval ? 'switcher-active-item' : ''
            }`}
          >
            {interval}
          </button>
        ))}
      </div>
      <div id="chart"></div>
    </div>
  );
};

export default ChartSwitcher;
