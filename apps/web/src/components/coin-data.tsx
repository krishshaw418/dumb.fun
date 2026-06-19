import { useState, useEffect } from "react";
import { structureTokenData } from "@/lib/utils";
import { useParams } from "react-router";
import axios from "axios";
import { toast } from "sonner";
import type { TokenDataUi } from "@/lib/types";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import "@/components/css/token-card.css";
import type { Token } from "types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import CopyToClipboard from "@/components/ui/copy";
import { Skeleton } from "./ui/skeleton";

function CoinData() {
  const params = useParams();
  const [coin, setCoin] = useState<TokenDataUi | undefined>(undefined);
  const [mint, setMint] = useState<string | null>(null);
  const [creator, setCreator] = useState<
    { pubKey: string; avatarImg: string } | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCoinData = async (mint: string) => {
      try {
        const response = await axios(
          `${import.meta.env.VITE_BASE_API_URL}/api/coin/${mint}`,
        );

        const data = response.data;
        if (!data.success) {
          console.error(data.error);
          return;
        }

        setMint(data.data.mint);
        setCreator({
          pubKey: (data.data as Token).creator,
          avatarImg:
            "https://pump.mypinata.cloud/ipfs/QmbbpJXptHMtmYNH3paXUZxjivtfqXkR1e4DTycWvyFat3?img-width=88&img-dpr=2&img-onerror=redirect",
        });
        const structuredTokenData = await structureTokenData(data.data);

        if (structuredTokenData) {
          setCoin(structuredTokenData);
          setIsLoading(false);
        } else {
          console.error("Failed to structure coin data!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong!");
      }
    };
    if (params.mint) {
      fetchCoinData(params.mint);
    }
  }, []);

  return (
    <>
      {coin && !isLoading && (
        <Card className="w-5/8 h-1/4 bg-[#18191b] rounded-lg p-5 text-white">
          <CardContent className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-22 h-22 aspect-square rounded-lg overflow-hidden">
                <img
                  src={coin.img}
                  alt="coin-img"
                  className="aspect-square scale-100 hover:scale-110 transition-transform duration-200"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="space-x-4">
                  <span className="font-extrabold text-xl">{coin.name}</span>
                  <span className="font-extrabold text-base secondary-text-color">
                    {coin.symbol}
                  </span>
                </div>
                {creator && (
                  <div className="flex items-center gap-2 secondary-text-color">
                    <Badge className="secondary-text-color bg-[#212225] border-[#9d9da6] rounded-lg">
                      Solana
                    </Badge>
                    <span>
                      <Avatar size="sm">
                        <AvatarImage
                          src={creator?.avatarImg}
                          alt="@dumb-fun"
                          className="bg-black"
                        />
                        <AvatarFallback>ML</AvatarFallback>
                      </Avatar>
                    </span>
                    <span>{creator.pubKey.slice(0, 6)}</span>
                    <span>
                      {coin.createdAt} {"ago"}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {mint && (
              <Badge className="bg-[#212225] p-4.5 rounded-lg">
                <CopyToClipboard className="flex gap-5 text-lg px-2 rounded-2xl">
                  {mint.slice(0, 6)}
                </CopyToClipboard>
              </Badge>
            )}
          </CardContent>
          <CardDescription className="border-0 text-white">
            {coin.description}
          </CardDescription>
        </Card>
      )}
    </>
  );
}

export default CoinData;
