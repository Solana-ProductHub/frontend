import ProjectForm from "@/components/projectForm";
import WalletConnection from "@/components/wallet";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";

function List() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const { address, isConnected, status } = useAppKitAccount();

  useEffect(() => {
    const checkOrCreateUser = async () => {
      if (!isConnected || !address) return;
      
      setIsCheckingUser(true);
      try {
        // First, check if user exists
        const checkResponse = await fetch(
          `${import.meta.env.VITE_ENDPOINT_URL}/api/user?walletAddress=${address}`
        );
        
        if (checkResponse.status === 404) {
          // User doesn't exist, create new user
          const createResponse = await fetch(
            `${import.meta.env.VITE_ENDPOINT_URL}/api/users/create`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ walletAddress: address }),
            }
          );
          
          if (!createResponse.ok) {
            throw new Error("Failed to create user");
          }
          console.log("New user created successfully");
        } else if (!checkResponse.ok) {
          throw new Error("Failed to check user existence");
        }
        
        // User exists or was created successfully
        setShowForm(true);
      } catch (error) {
        console.error("Error handling user check/create:", error);
        // Handle error appropriately (maybe show a toast notification)
      } finally {
        setIsCheckingUser(false);
      }
    };

    checkOrCreateUser();
  }, [isConnected, address]);

  if (!isConnected) {
    console.log("Wallet not connected");
  } else if (isConnected && !address) {
    console.log("Wallet connected but no wallet info available");
  }

  console.log("AppKit Account Address:", address);
  console.log("AppKit Account Status:", status);

  return (
    <div className="flex flex-col items-center gap-4 justify-center py-16 w-full h-full">
      {/* Back button at the top */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          padding: "8px 18px",
          borderRadius: 6,
          border: "none",
          background: "#111111",
          color: "#fff",
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        ← Back
      </button>
      <div className="w-full h-full flex flex-col items-center justify-center">
        {!showForm && (
          <p className="mb-4 text-center text-gray-600 max-w-md">
            {isCheckingUser
              ? "Verifying your wallet information..."
              : "Please connect your wallet to list your project! Connecting your wallet helps us verify your identity and enables secure project submissions."}
          </p>
        )}
      </div>
      <WalletConnection />
      {showForm && !isCheckingUser && (
        <>
          <ProjectForm />
        </>
      )}
    </div>
  );
}

export default List;