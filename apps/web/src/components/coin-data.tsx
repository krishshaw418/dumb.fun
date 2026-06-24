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
import { IoCopyOutline } from "react-icons/io5";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogContent,
  DialogHeader,
} from "./ui/dialog";
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

  const truncateAddesss = (mint: string) => {
    return `${mint.slice(0, 4)}...${mint.slice(mint.length - 4)}`;
  };

  const handleClick = async () => {
    if (mint) {
      await navigator.clipboard.writeText(mint);
      toast.success("Address copied to clipboard");
    }
  };

  return (
    <Card className="bg-[#18191b] rounded-lg p-5 text-white col-span-2">
      <CardContent className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <div className="w-22 h-22 aspect-square rounded-lg overflow-hidden">
                {coin?.img ? (
                  <img
                    src={coin.img}
                    alt="coin-img"
                    className="aspect-square scale-100 hover:scale-110 transition-transform duration-200"
                  />
                ) : (
                  <Skeleton className="aspect-square" />
                )}
              </div>
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center justify-center sm:max-w-[50%] bg-[#15161b] rounded-lg">
              <DialogHeader className="flex flex-col items-center">
                {coin?.name ? (
                  <span className="primary-text-color text-lg font-bold">
                    {coin.name}
                  </span>
                ) : (
                  <Skeleton />
                )}
                <span className="secondary-text-color text-sm">
                  {coin?.symbol}
                </span>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <img
                src={coin?.img}
                alt="coin-img"
                className="w-[70%] h-[70%] aspect-square rounded-lg"
              />
            </DialogContent>
          </Dialog>
          <div className="flex flex-col gap-2">
            <div>
              {coin ? (
                <div className="space-x-4">
                  <span className="font-extrabold text-xl">{coin.name}</span>
                  <span className="font-extrabold text-base secondary-text-color">
                    {coin.symbol}
                  </span>
                </div>
              ) : (
                <Skeleton className="h-4 w-full rounded-lg" />
              )}
            </div>
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
              <span>{creator?.pubKey.slice(0, 6)}</span>
              <span>
                {coin?.createdAt} {"ago"}
              </span>
            </div>
          </div>
        </div>

        {mint ? (
          <Badge
            className="bg-[#212225] p-4.5 rounded-lg text-base flex items-center gap-2 transition-all duration-150 ease-in-out active:scale-95 hover:cursor-pointer"
            onClick={handleClick}
          >
            <IoCopyOutline />
            {truncateAddesss(mint)}
          </Badge>
        ) : (
          <Skeleton className="h-10 w-[15%] rounded-lg" />
        )}
      </CardContent>
      {coin?.description ? (
        <CardDescription className="border-0 text-white">
          {coin.description}
        </CardDescription>
      ) : (
        <div className="flex flex-col gap-1">
          <Skeleton className="h-3 w-[50%] rounded-lg" />
          <Skeleton className="h-3 w-[25%] rounded-lg" />
          <Skeleton className="h-3 w-[15%] rounded-lg" />
        </div>
      )}
    </Card>
  );
}

export default CoinData;
