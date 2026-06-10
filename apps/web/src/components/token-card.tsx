import { Card, CardHeader, CardContent } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import "./css/token-card.css";

function TokenCard() {
  const creatorData = {
    pubKey: "BXAWg4JbaeyvAHpiyYQ3Xr3bUh6FsyDHwwSkB5dmyGF",
    avatarImg:
      "https://pump.mypinata.cloud/ipfs/QmbbpJXptHMtmYNH3paXUZxjivtfqXkR1e4DTycWvyFat3?img-width=88&img-dpr=2&img-onerror=redirect",
  };

  const tokenData = {
    creator: "BXAWg4JbaeyvAHpiyYQ3Xr3bUh6FsyDHwwSkB5dmyGF",
    img: "https://images.pump.fun/coin-image/ACtfUWtgvaXrQGNMiohTusi5jcx5RJf5zwu9aAxkpump?variant=600x600&ipfs=bafkreibm2rehj36ekplu7ilfmu5npmpmn5vdl3izlat2dkobhthzvfo2fm&src=https%3A%2F%2Fpump.mypinata.cloud%2Fipfs%2Fbafkreibm2rehj36ekplu7ilfmu5npmpmn5vdl3izlat2dkobhthzvfo2fm",
    name: "unc",
    symbol: "$unc",
    description:
      "Decentralized federated learning - on-chain verification, IPFS model storage, zero data transfer.",
    marketCap: "1.27M",
    createdAt: "2y",
  };

  return (
    <Card className="bg-transparent">
      <CardHeader>
        <img src={tokenData.img} alt="coin-image" className="rounded-md" />
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        <span>
          <p
            aria-label="coin-name"
            className="font-extrabold text-2xl primary-text-color"
          >
            {tokenData.name}
          </p>
          <p
            aria-label="symbol"
            className="text-lg font-extralight secondary-text-color"
          >
            {tokenData.symbol}
          </p>
        </span>
        <span aria-label="market-cap" className="flex items-baseline gap-2">
          <p className="font-extrabold text-xl primary-text-color">
            {tokenData.marketCap}
          </p>
          <p className="secondary-text-color text-base font-extralight">MC</p>
        </span>

        <span className="flex items-center gap-2 secondary-text-color">
          <Avatar size="sm">
            <AvatarImage
              src={creatorData.avatarImg}
              alt="@dumb-fun"
              className="bg-black"
            />
            <AvatarFallback>ML</AvatarFallback>
          </Avatar>
          <p aria-label="owner">{creatorData.pubKey.substring(0, 6)}</p>
          <p aria-label="created-at">{tokenData.createdAt}</p>
        </span>
        <span>
          <p className="line-clamp-2 secondary-text-color font-extralight">
            {tokenData.description}
          </p>
        </span>
      </CardContent>
    </Card>
  );
}

export default TokenCard;
