import ProjectForm from "@/components/projectForm";
import { useNavigate } from "react-router-dom";
import ConnectButton from "@/components/connectbtn"
import useUser from "@/hooks/useUser";

function List() {
  const navigate = useNavigate();
  const { connected } = useUser();

  return (
    <div className="flex flex-col items-center gap-4 justify-center py-16 w-full h-full">
      {/* Navigation buttons */}
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

      {/* Always show ConnectButton at the top */}
      <div className="mb-8">
        <ConnectButton />
      </div>

      {/* Conditional rendering */}
      {!connected ? (
        <p className="mb-4 text-center text-gray-600 max-w-md">
          Please connect your wallet...
        </p>
      ) : (
        <ProjectForm />
      )}
    </div>
  );
}

export default List;