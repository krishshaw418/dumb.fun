import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";
import "@/components/css/token-card.css";
import { useWallet } from "@solana/wallet-adapter-react";
import { GearFineIcon } from "@phosphor-icons/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "./ui/dialog";
import TradeSettings from "./trade-settings";

function Swap() {
  const [isSelected, setIsSelected] = useState<"buy" | "sell">("buy");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [amount, setAmount] = useState("");
  const wallet = useWallet();

  const presetAmts = window.localStorage
    .getItem("tradebox.quickBuyPresets.sol")
    ?.split(",") ?? ["0.1", "0.5", "1"];
  const maxSlippage = window.localStorage.getItem("max-trade-slippage")
    ? Number(window.localStorage.getItem("max-trade-slippage"))
    : 2;

  return (
    <Card className="col-span-1 rounded-lg p-5 bg-[#18191b] text-white">
      <CardHeader className="grid grid-cols-2">
        <Button
          type="button"
          className={
            isSelected === "buy"
              ? "bg-[#1fd978] hover:bg-[#1fd978] text-base text-[#18191b] rounded-2xl col-span-1 transition-all duration-350"
              : "bg-transparent hover:bg-gray-700/30 text-base rounded-2xl col-span-1 transition-all duration-350"
          }
          onClick={() => setIsSelected("buy")}
        >
          Buy
        </Button>
        <Button
          type="button"
          className={
            isSelected === "sell"
              ? "bg-[#ef4444] hover:bg-[#ef4444] text-base rounded-2xl col-span-1 transition-all duration-350"
              : "bg-transparent hover:bg-gray-700/30 text-base rounded-2xl col-span-1 transition-all duration-350"
          }
          onClick={() => setIsSelected("sell")}
        >
          Sell
        </Button>
      </CardHeader>
      <CardContent className="relative flex w-full min-w-0 flex-col items-stretch gap-2 pt-3">
        <div
          className="flex items-center justify-center gap-2 overflow-hidden min-w-0 px-2"
          style={{
            height: "68px",
          }}
        >
          <label className="flex min-w-0 cursor-text items-baseline gap-1 overflow-hidden">
            <span
              aria-hidden={true}
              className="text-5xl secondary-text-color pointer-events-none shrink-0 select-none"
              style={{
                display: isActive ? "none" : "",
              }}
            >
              0
            </span>
            <input
              id="amount"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              pattern="[0-9]*\.?[0-9]*"
              className="bg-transparent caret-text-primary outline-none max-w-full min-w-0 field-sizing-content"
              style={{
                fontSize: "56px",
                lineHeight: 1,
              }}
              value={amount}
              onChange={(e) => {
                if (e.target.value.length === 0) {
                  setIsActive(false);
                  setAmount("");
                } else {
                  setIsActive(true);
                  setAmount(e.target.value);
                }
              }}
            />
          </label>
          <button
            type="button"
            className="flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-medium uppercase"
          >
            <span
              style={{
                opacity: 1,
                transform: "none",
              }}
            >
              SOL
            </span>
            <span aria-hidden={true} className="texy-[10px] opacity-70">
              &#x21C5;
            </span>
          </button>
        </div>
        <div className="h-4 text-center text-xs">
          <div
            className="opacity-75 transform-none"
            style={{
              display: isActive ? "" : "none",
            }}
          >
            ≈ $369.08 ≈ 855,393.05 MYLOO
          </div>
        </div>
        <div className="flex gap-2 text-base py-2">
          {presetAmts.map((amt, id) => {
            return (
              <button
                key={id}
                type="button"
                className="flex-1 items-stretch p-2"
              >
                {amt} SOL
              </button>
            );
          })}
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center justify-center px-2.5">
                <GearFineIcon className="flex items-center justify-center" />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#111113] text-white rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-base">Trade Settings</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <TradeSettings />
            </DialogContent>
          </Dialog>
        </div>
        <Accordion
          type="single"
          collapsible
          defaultValue="item-1"
          style={{ display: isActive ? "" : "none" }}
          className="px-3"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>
              {"You will receive"} &#8776; {`63,985,194.9155`} {`$TEST`}
            </AccordionTrigger>
            <AccordionContent>
              <ul>
                <li className="flex justify-between">
                  <span>Min received {`62,906,499.4949`}</span>{" "}
                  <span>{`LASSE`}</span>
                </li>
                <li className="flex justify-between">
                  <span>Max slippage</span>
                  <span>{maxSlippage}%</span>
                </li>
                <li className="flex justify-between">
                  <span>Network + tip</span>{" "}
                  <span>
                    {`0.00101`} SOL (${`0.07`})
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>MEV protection</span>
                  <span>{`Off`}</span>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter
        className={`border-0 h-10 flex justify-center rounded-md mb-5 ${isSelected === "buy" ? "bg-[#1fd978] hover:bg-[#1fd978]" : "bg-[#ef4444] hover:bg-[#ef4444]"}`}
      >
        <Button
          type="submit"
          className={`text-base bg-transparent hover:bg-transparent ${isSelected === "buy" ? "text-[#18191b]" : ""}`}
        >
          {wallet.connected
            ? isSelected === "buy"
              ? "Buy"
              : "Sell"
            : "Connect wallet to trade"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Swap;
