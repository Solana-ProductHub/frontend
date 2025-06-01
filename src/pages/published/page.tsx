import WalletConnection from "@/components/wallet";

import { useNavigate } from "react-router-dom";
import MyProjects from "@/components/MyProjects";
import useUser from "@/hooks/useUser";

function Published() {
  const navigate = useNavigate();
  const { isCheckingUser, showContent } = useUser();

  return (
    <div className="flex flex-col items-center gap-4 justify-center py-16 w-full h-full">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 bg-black text-white px-4 py-2 rounded"
      >
        ← Back
      </button>

      {!showContent && (
        <div className="text-center max-w-md text-gray-600">
          {isCheckingUser
            ? "Verifying your wallet information to view published projects..."
            : "Please connect your wallet to view published projects."}
        </div>
      )}

      <WalletConnection />
      {showContent && !isCheckingUser && <MyProjects />}
    </div>
  );
}

export default Published;
