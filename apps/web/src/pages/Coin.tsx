import CoinData from "@/components/coin-data";
import Swap from "@/components/swap";

function Coin() {
  return (
    <div className="m-5 grid grid-cols-3 gap-x-5 items-start">
      <CoinData />
      <Swap />
    </div>
  );
}

export default Coin;
