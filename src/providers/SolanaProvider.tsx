// import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
// import { clusterApiUrl } from '@solana/web3.js';
import React, { useMemo } from 'react'

const SolanaProvider = ({ children }: {children: React.ReactNode}) => {
  const network = "https://mainnet.helius-rpc.com/?api-key=0cf14e96-6d07-4237-8519-36bc65dbd632";
  const endpoint = useMemo<string>(() => network, [network])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect={true}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default SolanaProvider