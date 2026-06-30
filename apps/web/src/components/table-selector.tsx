import { useState } from "react";
import Holders from "./holders";
import { Button } from "./ui/button";

function TableSelector() {
  const [isSelected, setIsSelected] = useState<"Holders" | "Trades">("Holders");

  return (
    <div className="flex flex-col gap-5">
      <div>
        <span className="bg-[#18191b] border border-[#212225] py-2 px-0.5 rounded-lg space-x-1">
          <Button
            type="button"
            className={`rounded-md bg-transparent hover:bg-transparent text-base py-4 text-[#9d9da6] ${isSelected === "Holders" ? "bg-[#86efac] hover:bg-[#86efac] text-black" : ""}`}
            onClick={() => {
              setIsSelected("Holders");
            }}
          >
            {"Holders"}
          </Button>
          <Button
            type="button"
            className={`rounded-md bg-transparent hover:bg-transparent text-base py-4 text-[#9d9da6] ${isSelected === "Trades" ? "bg-[#86efac] hover:bg-[#86efac] text-black" : ""}`}
            onClick={() => {
              setIsSelected("Trades");
            }}
          >
            {"Trades"}
          </Button>
        </span>
      </div>
      {isSelected === "Holders" ? <Holders /> : <></>}
    </div>
  );
}

export default TableSelector;
