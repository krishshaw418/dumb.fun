import {
  // createMetadataAccountV3,
  createV1,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";
import { useUmi } from "../lib/umi-provider";
import { publicKey, percentAmount } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";

export function useCreateMetadataPda() {
  const umi = useUmi();

  const createMetadataPda = async (
    mint: PublicKey,
    metaDataJson: {
      name: string;
      symbol: string;
      url: string;
    },
  ) => {
    const tx = await createV1(umi, {
      mint: publicKey(mint.toBase58()),
      payer: umi.identity,
      authority: umi.identity,
      updateAuthority: umi.identity,
      name: metaDataJson.name,
      symbol: metaDataJson.symbol,
      uri: metaDataJson.url,
      sellerFeeBasisPoints: percentAmount(2.5),
      isMutable: true,
      tokenStandard: TokenStandard.Fungible
    }).sendAndConfirm(umi);

    console.log(
      "Metadata account creation txn: ",
      base58.deserialize(tx.signature)[0],
    );
  };

  return { createMetadataPda };
}
