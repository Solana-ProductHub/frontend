import ProjectForm from "@/components/projectForm";
import WalletConnection from "@/components/wallet";
import { useWalletInfo } from "@reown/appkit/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function List() {
  const navigate = useNavigate();
  const { walletInfo } = useWalletInfo();
  const [showForm, setShowForm] = useState(!!walletInfo);

  useEffect(() => {
    setShowForm(!!walletInfo);
  }, [walletInfo]);

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
            Please connect your wallet to list your project. Connecting your
            wallet helps us verify your identity and enables secure project
            submissions.
          </p>
        )}
      </div>
      <WalletConnection />
      {showForm ? (
        <>
          <ProjectForm />
        </>
      ) : null}
    </div>
  );
}

export default List;
