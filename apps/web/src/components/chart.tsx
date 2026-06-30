import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  ColorType,
  CrosshairMode,
} from "lightweight-charts";
import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { LuArrowRightLeft } from "react-icons/lu";
import { Progress } from "./ui/progress";

function Chart() {
  const chartContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainer.current) {
      return;
    }

    const chart = createChart(chartContainer.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#9d9da6",
      },
      width: chartContainer.current.clientWidth,
      height: 300,
      crosshair: { mode: CrosshairMode.Normal },
      grid: {
        vertLines: {
          color: "#212225",
        },
        horzLines: {
          color: "#212225",
        },
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#4ade80",
      downColor: "#f87171",
      borderVisible: false,
      wickUpColor: "#4ade80",
      wickDownColor: "#f87171",
    });

    candlestickSeries.setData([
      {
        time: "2018-12-22",
        open: 75.16,
        high: 82.84,
        low: 36.16,
        close: 45.72,
      },
      { time: "2018-12-23", open: 45.12, high: 53.9, low: 45.12, close: 48.09 },
      {
        time: "2018-12-24",
        open: 60.71,
        high: 60.71,
        low: 53.39,
        close: 59.29,
      },
      { time: "2018-12-25", open: 68.26, high: 68.26, low: 59.04, close: 60.5 },
      {
        time: "2018-12-26",
        open: 67.71,
        high: 105.85,
        low: 66.67,
        close: 91.04,
      },
      { time: "2018-12-27", open: 91.04, high: 121.4, low: 82.7, close: 111.4 },
      {
        time: "2018-12-28",
        open: 111.51,
        high: 142.83,
        low: 103.34,
        close: 131.25,
      },
      {
        time: "2018-12-29",
        open: 131.33,
        high: 151.17,
        low: 77.68,
        close: 96.43,
      },
      {
        time: "2018-12-30",
        open: 106.33,
        high: 110.2,
        low: 90.39,
        close: 98.1,
      },
      {
        time: "2018-12-31",
        open: 109.87,
        high: 114.69,
        low: 85.66,
        close: 111.26,
      },
    ]);

    chart.timeScale().fitContent();

    const handleResize = () => {
      chart.applyOptions({ width: chartContainer.current?.clientWidth });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, []);

  return (
    <Card className="w-full h-full bg-[#18191b] p-5 rounded-lg border border-[#212225]">
      <CardHeader className="grid grid-cols-2 items-baseline-last justify-between text-[#9d9da6] text-sm">
        <div className="flex flex-col gap-2 col-span-1">
          <span className="flex items-center gap-2">
            Market cap. <LuArrowRightLeft />
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl text-white font-extrabold">{"$200K"}</span>
            <span className="text-sm">{"$170K (+577.87%) 24hr"}</span>
          </div>
        </div>
        <div className="grid grid-cols-[9fr_0.5fr_0.5fr] gap-2 items-center">
          <Progress value={63} className="h-2 rounded-lg bg-[#4b5563]" />
          <span>{"ATH"}</span>
          <span className="text-white font-extrabold">{"$463K"}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartContainer} className="w-full hover:cursor-crosshair" />
      </CardContent>
    </Card>
  );
}

export default Chart;
