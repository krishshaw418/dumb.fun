import { createMetadataAccountV3 } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";
import { useUmi } from "./umi-provider";
import { publicKey } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";

export function useCreateMetadataPda() {
  const { umi } = useUmi();

  const createMetadataPda = async (
    mint: PublicKey,
    metaDataJson: {
      name: string;
      symbol: string;
      url: string;
    },
  ) => {
    const tx = await createMetadataAccountV3(umi, {
      mint: publicKey(mint.toBase58()),
      mintAuthority: umi.identity,
      updateAuthority: umi.identity,
      data: {
        name: metaDataJson.name,
        symbol: metaDataJson.symbol,
        uri: metaDataJson.url,
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null,
      },
      isMutable: true,
      collectionDetails: null,
    }).sendAndConfirm(umi);

    console.log(
      "Metadata account creation txn: ",
      base58.deserialize(tx.signature)[0],
    );
  };

  return { createMetadataPda };
}
