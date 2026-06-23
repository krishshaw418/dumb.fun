import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import "@/components/css/token-card.css";

function TradeSettings() {
  const defaultAmounts = window.localStorage.getItem(
    "tradebox.quickBuyPresets.sol",
  );
  const defaultSlippage = window.localStorage.getItem("max-trade-slippage");

  const [amounts, setAmounts] = useState<string[]>(
    defaultAmounts ? defaultAmounts.split(",") : ["0.1", "0.5", "1"],
  );
  const [slippage, setSlippage] = useState<number>(
    defaultSlippage ? Number(defaultSlippage) : 2,
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-sm">Quick amounts</h1>
          <p className="text-[10px] secondary-text-color">
            Customize the SOL preset buttons shown below the amount input.
          </p>
        </div>
        <div className="flex gap-2 items-stretch justify-between">
          {amounts.map((amt, id) => {
            return (
              <Input
                key={id}
                value={amt}
                type="number"
                step={0.01}
                min={0.01}
                onChange={(e) => {
                  setAmounts((prev) => {
                    const next = [...prev];
                    next[id] = e.target.value;
                    return next;
                  });
                }}
                className="w-full bg-[#141416] rounded-md border-0"
              />
            );
          })}
          <Button
            className="bg-[#141416] rounded-md"
            type="button"
            onClick={() => {
              setAmounts((prev) => {
                prev = ["0.1", "0.5", "1"];
                window.localStorage.setItem(
                  "tradebox.quickBuyPresets.sol",
                  prev.toString(),
                );
                return prev;
              });
            }}
          >
            Reset
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-sm">Max slippage</h1>
          <p className="text-[10px] secondary-text-color">
            How much price change you'll accept. Higher means the trade is more
            likely to land, but may get a worse price.
          </p>
        </div>
        <div className="grid grid-cols-3 items-center gap-2">
          <Slider
            value={[slippage]}
            max={25}
            min={0.1}
            step={0.1}
            className="w-full max-w-xs col-span-2 bg-[#141416]"
            onValueChange={(value) => {
              setSlippage(value[0]);
            }}
          />{" "}
          <div className="flex gap-2 items-center col-span-1">
            <Input
              type="number"
              value={slippage}
              max={25}
              step={0.1}
              min={0.1}
              className="w-[80%] bg-[#141416] rounded-md border-0"
              onChange={(e) => {
                setSlippage(Number(e.target.value));
              }}
            />
            {"%"}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] text-[#9d9da6] hover:underline hover:text-white"
          onClick={() => {
            setSlippage((prev) => {
              prev = 2;
              window.localStorage.setItem(
                "max-trade-slippage",
                prev.toString(),
              );
              return prev;
            });
          }}
        >
          Reset to defaults
        </span>
        <Button
          className="rounded-md bg-[#86efac] hover:bg-[#86efac] text-black font-bold"
          onClick={() => {
            window.localStorage.setItem(
              "max-trade-slippage",
              slippage.toString(),
            );
            window.localStorage.setItem(
              "tradebox.quickBuyPresets.sol",
              amounts.toString(),
            );
          }}
        >
          Save settings
        </Button>
      </div>
    </div>
  );
}

export default TradeSettings;
