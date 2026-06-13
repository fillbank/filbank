import { StrictMode, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack'
import { WalletConnectWalletAdapter } from '@solana/wallet-adapter-walletconnect'
import './index.css'
import App from './App.jsx'

const SOLANA_RPC = 'https://api.mainnet-beta.solana.com'

function Root() {
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new BackpackWalletAdapter(),
    new WalletConnectWalletAdapter({
      network: 'mainnet-beta',
      options: { projectId: '4e7c5fe0ab68faaeb8267cc324f5e781' }
    }),
  ], [])

  return (
    <StrictMode>
      <ConnectionProvider endpoint={SOLANA_RPC}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <App />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')).render(<Root />)