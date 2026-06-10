import { Card, CardHeader, CardContent } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

function TokenCard() {
  return (
    <Card>
      <CardHeader>
        <img
          src="https://amethsyt.xyz/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmy_github_profile.5959696a.jpeg&w=828&q=75"
          alt="coin-image"
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        <div className="text-[14px]">
          <p aria-label="coin-name" className="font-extrabold text-lg">
            Mad Lads
          </p>
          <p aria-label="symbol">$ML</p>
        </div>
        <span aria-label="market-cap" className="text-[14px]">
          $331 MC
        </span>
        <span className="flex items-center gap-2">
          <Avatar size="sm">
            <AvatarImage
              src="https://pump.mypinata.cloud/ipfs/QmafRgG2yvM4G4G1jcLqBkMxZSkyxtRQZgxsNzxrpYDtMh?img-width=88&img-dpr=2&img-onerror=redirect"
              alt="@dumb-fun"
            />
            <AvatarFallback>ML</AvatarFallback>
          </Avatar>
          <p aria-label="owner">9bNztr</p>
          <p aria-label="created-at">2y</p>
        </span>
        <span>
          <p className="truncate">
            Decentralized federated learning - on-chain verification, IPFS model
            storage, zero data transfer.
          </p>
        </span>
      </CardContent>
    </Card>
  );
}

export default TokenCard;
