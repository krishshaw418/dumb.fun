import { TokenCreateForm } from "@/components/metadata-form";
import { BondingCurveInitForm } from "@/components/curve-init-form";
import MintAddressDisplay from "@/components/mint-address";
import { PublicKey } from "@solana/web3.js";
import { useState } from "react";
function Create() {
  const [mint, setMint] = useState<PublicKey>();

  return (
    <div className="flex gap-5 m-5">
      <TokenCreateForm setMint={setMint} />
      <div className="w-full flex flex-col gap-5">
        <MintAddressDisplay mint={mint?.toBase58()} />
        <BondingCurveInitForm />
      </div>
    </div>
  );
}

export default Create;
