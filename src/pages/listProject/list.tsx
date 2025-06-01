import ProjectForm from "@/components/projectForm";
import { useNavigate } from "react-router-dom";
import useUser from "@/hooks/useUser";
import ConnectButton from "@/components/connectbtn";

function List() {
  const navigate = useNavigate();
  const { isCheckingUser, showContent } = useUser()

  return (
    <div className="flex flex-col items-center gap-4 justify-center py-16 w-full h-full">
      <div>
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
        <button
          onClick={() => navigate("/publised")}
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            padding: "8px 18px",
            borderRadius: 6,
            border: "none",
            background: "#111111",
            color: "#fff",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Published Projects
        </button>
      </div>
      <div className="w-full h-full flex flex-col items-center justify-center">
        {!showContent && (
          <p className="mb-4 text-center text-gray-600 max-w-md">
            {isCheckingUser
              ? "Verifying your wallet information..."
              : "Please connect your wallet to list your project! Connecting your wallet helps us verify your identity and enables secure project submissions."}
          </p>
        )}
      </div>
      <ConnectButton />
      {showContent && !isCheckingUser && <ProjectForm />}
    </div>
  );
}

export default List;
