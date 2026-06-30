import { lazy, Suspense } from "react";
const CoinData = lazy(() => import("@/components/coin-data"));
const Swap = lazy(() => import("@/components/swap"));
import { Skeleton } from "@/components/ui/skeleton";
import Chart from "@/components/chart";
import CurveProgress from "@/components/curve-progress";
import TradeMetrics from "@/components/trade-metrics";
import TableSelector from "@/components/table-selector";

function Coin() {
  return (
    <div className="m-5 grid grid-cols-3 gap-x-5 items-start">
      <Suspense
        fallback={<Skeleton className="h-[200] col-span-2 rounded-lg" />}
      >
        <div className="col-span-2 flex flex-col gap-5">
          <CoinData />
          <Chart />
          <TradeMetrics />
          <TableSelector />
        </div>
      </Suspense>
      <Suspense
        fallback={<Skeleton className="h-[400] col-span-1 rounded-lg" />}
      >
        <div className="flex flex-col gap-5">
          <Swap />
          <CurveProgress />
        </div>
      </Suspense>
    </div>
  );
}

export default Coin;
