import { createAppKit } from "@reown/appkit/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import { metadata, projectId, solanaWeb3JsAdapter } from "../config";

// Create modal
createAppKit({
  projectId,
  metadata,
  themeMode: "light",
  networks: [solana, solanaTestnet, solanaDevnet],
  adapters: [solanaWeb3JsAdapter],
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
  themeVariables: {
    "--w3m-accent": "#000000",
  },
});

export function WalletConnection() {

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <appkit-button />
      {/* <ActionButtonList sendHash={receiveHash} sendSignMsg={receiveSignedMsg} sendBalance={receivebalance}/> */}
    </div>
  );
}

export default WalletConnection;
