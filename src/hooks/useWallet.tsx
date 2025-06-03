import { useAppKitAccount, useAppKitEvents, useAppKitProvider, useAppKitState, useWalletInfo } from '@reown/appkit/react';
import { useClientMounted } from './useClientMounted';
import { useAppKitConnection, type Provider as SolanaProvider } from "@reown/appkit-adapter-solana/react"

const useWallet = () => {
    const state = useAppKitState();
    const events = useAppKitEvents();
    const walletInfo = useWalletInfo();
    const {
        address,
        caipAddress,
        isConnected,
        embeddedWalletInfo
    } = useAppKitAccount();
    const { connection } = useAppKitConnection()
    const { walletProvider } = useAppKitProvider<SolanaProvider>("solana");
    const mounted = useClientMounted()

    return {
        state,
        address,
        events,
        mounted,
        walletInfo,
        connection,
        caipAddress,
        isConnected,
        embeddedWalletInfo,
        walletProvider,
    }
}

export default useWallet