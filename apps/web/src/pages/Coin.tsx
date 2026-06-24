import { lazy, Suspense } from "react";
const CoinData = lazy(() => import("@/components/coin-data"));
const Swap = lazy(() => import("@/components/swap"));
import { Skeleton } from "@/components/ui/skeleton";

function Coin() {
  return (
    <div className="m-5 grid grid-cols-3 gap-x-5 items-start">
      <Suspense
        fallback={<Skeleton className="h-[200] col-span-2 rounded-lg" />}
      >
        <CoinData />
      </Suspense>
      <Suspense
        fallback={<Skeleton className="h-[400] col-span-1 rounded-lg" />}
      >
        <Swap />
      </Suspense>
    </div>
  );
}

export default Coin;
