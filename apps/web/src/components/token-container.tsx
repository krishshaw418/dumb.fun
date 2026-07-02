import TokenCard from "./token-card";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useTokenStore } from "@/store/token-store";

function TokenContainer() {
  const tokens = useTokenStore((state) => state.tokens);
  const setTokens = useTokenStore((state) => state.setTokens);

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
  }, [tokens]);

  return (
    <div className="grid gap-5 grid-row-auto sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 sm:justify-center">
      {tokens.map((token, id) => {
        return (
          <TokenCard key={id} token={token}/>
        )
      })}
    </div>
  );
}

export default TokenContainer;
