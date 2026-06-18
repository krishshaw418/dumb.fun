import TokenCard from "./token-card";
import { useState, useEffect } from "react";
import type { Token } from "types";
import axios from "axios";
import { toast } from "sonner";

function TokenContainer() {
  const [tokens, setTokens] = useState<Token[] | null>(null);

  useEffect(() => {
    const fetchAllTokens = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/api/fetchAllCoins`,
        );

        const data = response.data;
        if (!data.success) {
          console.error(data.error);
          return;
        } else {
          // console.log(data.data);
          setTokens(data.data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong!");
      }
    };

    fetchAllTokens();
  }, []);

  return (
    <div className="grid gap-5 grid-row-auto grid-cols-6">
      {tokens && tokens.map((token, id) => {
        return (
          <TokenCard key={id} token={token}/>
        )
      })}
    </div>
  );
}

export default TokenContainer;
