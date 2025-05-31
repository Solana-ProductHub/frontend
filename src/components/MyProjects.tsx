import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Project = {
  uuid: string;
  name: string;
  logoURI: string;
  description: string;
  bDescription: string;
  status: "PENDING" | "DECLINED" | "PUBLISHED";
  bannerURI?: string;
  state?: string;
  track?: string;
};

function MyProjects() {
  const { name } = useParams<{ name: string }>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!name) {
          setLoading(false);
          return;
        }

        const productName = decodeURIComponent(name);

        const res = await fetch(
          `${import.meta.env.VITE_ENDPOINT_URL}/api/products/${productName}`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched user projects:", data);

        if (data?.status && data.data) {
          setProjects(data.data);
          console.log("Projects set:", data.data);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error("Failed to fetch user projects:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch projects");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [name]);

  if (loading) return <p className="text-center mt-10">Loading user projects...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  if (!projects.length) return <p className="text-center mt-10 text-gray-500">No projects found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
      {projects.map((project) => (
        <div key={project.uuid} className="bg-white shadow-md rounded-xl p-4 border hover:shadow-lg transition">
          {project.bannerURI && (
            <img
              src={project.bannerURI}
              alt={`${project.name} banner`}
              className="w-full h-32 object-cover mb-4 rounded-t"
            />
          )}
          <div className="flex items-start gap-4">
            <img
              src={project.logoURI}
              alt={project.name}
              className="h-16 w-16 object-contain rounded border"
            />
            <div>
              <h2 className="text-xl font-semibold mb-1">{project.name}</h2>
              <span className={`inline-block text-xs px-2 py-1 rounded ${
                project.status === "PUBLISHED" ? "bg-green-100 text-green-800" :
                project.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              }`}>
                {project.status}
              </span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-3">
            {project.description || project.bDescription || "No description"}
          </p>
          {(project.state || project.track) && (
            <div className="mt-3 flex gap-2">
              {project.track && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {project.track}
                </span>
              )}
              {project.state && (
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  {project.state}
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default MyProjects;