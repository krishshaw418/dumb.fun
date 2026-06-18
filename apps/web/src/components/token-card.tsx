import { Card, CardHeader, CardContent } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import "./css/token-card.css";
import type { Token } from "types";
import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import type { TokenDataUi } from "@/lib/types";
import { structureTokenData } from "@/lib/utils";

function TokenCard(props: {
  token: Token | undefined
}) {

  const [tokenData, setTokenData] = useState<TokenDataUi | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const creatorData = {
    pubKey: props.token?.creator,
    avatarImg:
      "https://pump.mypinata.cloud/ipfs/QmbbpJXptHMtmYNH3paXUZxjivtfqXkR1e4DTycWvyFat3?img-width=88&img-dpr=2&img-onerror=redirect",
  };

  useEffect(() => {
    const setData = async () => {
      if (props.token) {
        const structuredTokenData = await structureTokenData(props.token);
        if (structuredTokenData) {
          setTokenData(structuredTokenData);
          setIsLoading(false);
        }
      } else {
        return;
      }
    }
    setData();
  }, []);

  return (
    <Card className="bg-transparent grid grid-rows-2">
      <CardHeader className="aspect-square">
        {isLoading? <Skeleton className="aspect-square rounded-lg"/>: <img src={tokenData?.img} alt="coin-image" className="aspect-square rounded-md" />}
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        <span className={isLoading? "space-y-2": ""}>
          {isLoading? <Skeleton className="h-5 w-2/3 rounded-sm"/>: <p
            aria-label="coin-name"
            className="font-extrabold text-2xl primary-text-color"
          >
            {tokenData?.name}
          </p>}
          {isLoading? <Skeleton className="h-5 w-1/3 rounded-sm"/>: <p
            aria-label="symbol"
            className="text-lg font-extralight secondary-text-color"
          >
            {tokenData?.symbol}
          </p>}
        </span>
        {isLoading? <Skeleton className="h-5 w-2/3 rounded-sm"/>: <span aria-label="market-cap" className={isLoading? "space-x-2": "flex items-baseline gap-2"}>
          <p className="font-extrabold text-xl primary-text-color">
            {tokenData?.marketCap}
          </p>
          <p className="secondary-text-color text-base font-extralight">MC</p>
        </span>}

        {isLoading? <Skeleton className="h-5 w-1/3 rounded-sm"/>: <span className="flex items-center gap-2 secondary-text-color">
          <Avatar size="sm">
            <AvatarImage
              src={creatorData.avatarImg}
              alt="@dumb-fun"
              className="bg-black"
            />
            <AvatarFallback>ML</AvatarFallback>
          </Avatar>
          <p aria-label="owner">{creatorData.pubKey?.substring(0, 6)}</p>
          <p aria-label="created-at">{tokenData?.createdAt}</p>
        </span>}
        {isLoading? <Skeleton className="h-5 w-2/3 rounded-sm"/>: <span>
          <p className="line-clamp-2 secondary-text-color font-extralight">
            {tokenData?.description}
          </p>
        </span>}
      </CardContent>
    </Card>
  );
}

export default TokenCard;
