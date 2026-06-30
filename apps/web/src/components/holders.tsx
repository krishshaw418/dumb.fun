import { Badge } from "./ui/badge";

function Holders() {
  const data = [
    {
      owner: "DzfDaWaASwLzz4SrPKPK5yV3F3Ay3boQCDYtKTKKNjMu",
      profile:
        "https://pump.mypinata.cloud/ipfs/bafkreidvsuqatgzy43gtpfyof4as4h4tqbsfmw64baxp5f57ftubox4shq?img-width=20&img-dpr=2&img-onerror=redirect",
      supply: "4.24",
      emc: "$35.3K",
      PnL: "+$175.84",
      pPnL: "+76.6%",
    },
    {
      owner: "DzfDaWaASwLzz4SrPKPK5yV3F3Ay3boQCDYtKTKKNjMu",
      profile:
        "https://pump.mypinata.cloud/ipfs/bafkreidvsuqatgzy43gtpfyof4as4h4tqbsfmw64baxp5f57ftubox4shq?img-width=20&img-dpr=2&img-onerror=redirect",
      supply: "4.24",
      emc: "$35.3K",
      PnL: "+$175.84",
      pPnL: "+76.6%",
    },
    {
      owner: "DzfDaWaASwLzz4SrPKPK5yV3F3Ay3boQCDYtKTKKNjMu",
      profile:
        "https://pump.mypinata.cloud/ipfs/bafkreidvsuqatgzy43gtpfyof4as4h4tqbsfmw64baxp5f57ftubox4shq?img-width=20&img-dpr=2&img-onerror=redirect",
      supply: "4.24",
      emc: "$35.3K",
      PnL: "+$175.84",
      pPnL: "+76.6%",
    },
    {
      owner: "DzfDaWaASwLzz4SrPKPK5yV3F3Ay3boQCDYtKTKKNjMu",
      profile:
        "https://pump.mypinata.cloud/ipfs/bafkreidvsuqatgzy43gtpfyof4as4h4tqbsfmw64baxp5f57ftubox4shq?img-width=20&img-dpr=2&img-onerror=redirect",
      supply: "4.24",
      emc: "$35.3K",
      PnL: "+$175.84",
      pPnL: "+76.6%",
    },
    {
      owner: "DzfDaWaASwLzz4SrPKPK5yV3F3Ay3boQCDYtKTKKNjMu",
      profile:
        "https://pump.mypinata.cloud/ipfs/bafkreidvsuqatgzy43gtpfyof4as4h4tqbsfmw64baxp5f57ftubox4shq?img-width=20&img-dpr=2&img-onerror=redirect",
      supply: "4.24",
      emc: "$35.3K",
      PnL: "+$175.84",
      pPnL: "+76.6%",
    },
    {
      owner: "DzfDaWaASwLzz4SrPKPK5yV3F3Ay3boQCDYtKTKKNjMu",
      profile:
        "https://pump.mypinata.cloud/ipfs/bafkreidvsuqatgzy43gtpfyof4as4h4tqbsfmw64baxp5f57ftubox4shq?img-width=20&img-dpr=2&img-onerror=redirect",
      supply: "4.24",
      emc: "$35.3K",
      PnL: "+$175.84",
      pPnL: "+76.6%",
    },
  ];

  const truncateAddesss = (mint: string) => {
    return `${mint.slice(0, 4)}...${mint.slice(mint.length - 4)}`;
  };

  return (
    <div className="rounded-lg bg-[#18191b] border border-[#212225]">
      <div className="border-b border-[#212225] flex flex-col gap-2 p-5">
        <div className="flex items-center gap-2">
          <span>{"Holders"}</span>
          <Badge className="bg-[#242527] rounded-lg p-2 text-[#9d9da6]">
            {data.length}
          </Badge>
        </div>
        <span className="text-sm text-[#9d9da6]">
          {"Wallets ranked by token balance for this coin."}
        </span>
      </div>
      <div>
        <table className="caption-bottom text-sm table-auto w-max min-w-full">
          <thead className="&_tr:border-b">
            <tr className="border-b border-[#212225]">
              <th className="text-left p-5 align-middle">{"Holder"}</th>
              <th className="text-right p-5 align-middle">{"% of supply"}</th>
              <th className="text-right p-5 align-middle">{"Entry mcap"}</th>
              <th className="text-right p-5 align-middle">{"PnL"}</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {data.map((data, id) => {
              return (
                <tr className="border-b border-[#212225]" key={id}>
                  <td>
                    <a
                      href="http://localhost:5173/profile"
                      className="flex shrink-0 items-center gap-3 p-5"
                    >
                      <img
                        src={data.profile}
                        alt="profile-img"
                        className="object-cover rounded-full w-8 h-8"
                      />
                      <div className="flex flex-col">
                        <span>{truncateAddesss(data.owner)}</span>
                        <span className="text-xs secondary-text-color">
                          {"0"} {"followers"}
                        </span>
                      </div>
                    </a>
                  </td>
                  <td className="text-right align-middle p-5">
                    <span>{data.supply}</span>
                  </td>
                  <td className="text-right align-middle p-5">
                    <span>{data.emc}</span>
                  </td>
                  <td className="text-right align-middle p-5">
                    <span>{data.PnL}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Holders;
