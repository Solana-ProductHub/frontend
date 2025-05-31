import WalletConnection from "@/components/wallet";
import { useEffect, useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useNavigate } from "react-router-dom";
import MyProjects from "@/components/MyProjects";

function Published() {
  const navigate = useNavigate();
  const [showProjects, setShowProjects] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const { address, isConnected } = useAppKitAccount();

  useEffect(() => {
    const checkOrCreateUser = async () => {
      if (!isConnected || !address) return;

      setIsCheckingUser(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_ENDPOINT_URL}/api/users/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ walletAddress: address }),
          }
        );

        const result = await response.json();
        if (result?.status) {
          setShowProjects(true);
        }
      } catch (error) {
        console.error("User check/create error:", error);
      } finally {
        setIsCheckingUser(false);
      }
    };

    checkOrCreateUser();
  }, [isConnected, address]);

  return (
    <div className="flex flex-col items-center gap-4 justify-center py-16 w-full h-full">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 bg-black text-white px-4 py-2 rounded"
      >
        ← Back
      </button>

      {!showProjects && (
        <div className="text-center max-w-md text-gray-600">
          {isCheckingUser
            ? "Verifying your wallet information to view published projects..."
            : "Please connect your wallet to view published projects."}
        </div>
      )}

      <WalletConnection />
      {showProjects && !isCheckingUser && <MyProjects />}
    </div>
  );
}

export default Published;
