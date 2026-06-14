import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { type Umi } from '@metaplex-foundation/umi';
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

type UmiContextType = {
  umi: Umi | null;
};

const UmiContext = createContext<UmiContextType>({ umi: null });

export const UmiProvider = ({ children }: { children: ReactNode }) => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const umi = useMemo(() => {
    if (!connection) return null;

    const umiInstance = createUmi(connection);

    if (wallet && wallet.publicKey) {
      umiInstance.use(walletAdapterIdentity(wallet));
    }

    umiInstance.use(irysUploader());

    return umiInstance;
  }, [connection, wallet]);

  return (
    <UmiContext.Provider value={{ umi }}>
      {children}
    </UmiContext.Provider>
  );
};

export const useUmi = (): Umi => {
  const { umi } = useContext(UmiContext);
  if (!umi) {
    throw new Error('useUmi must be used within an UmiProvider');
  }
  return umi;
};
