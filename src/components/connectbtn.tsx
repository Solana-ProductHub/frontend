import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import type { PublicKey } from '@solana/web3.js'

const ConnectButton = () => {
    const { connected, disconnect, publicKey } = useWallet()
    const { setVisible } = useWalletModal()

    function format(publicKey: PublicKey): string {
        if (!publicKey) return 'Connect Wallet'
        const address = publicKey.toBase58()
        return `${address.slice(0, 8)} *** ${address.slice(-6)}`

    }

    const handleConnection = () => connected ? disconnect() : setVisible(true)
    const buttonText = connected && publicKey ? format(publicKey) : 'Connect Wallet'

    return (
        <button
            className="cursor-pointer font-bold bg-neutral-900 shadow-sm text-white border dark:border-white/10 px-4 py-2 rounded-sm hover:bg-neutral-800 hover:scale-[1.05] transition-all duration-300"
            onClick={handleConnection}
        >
            {buttonText}
        </button>
    )
}

export default ConnectButton