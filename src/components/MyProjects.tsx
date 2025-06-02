import { useUserProjects } from "@/hooks/useProjects";
import { Link } from "react-router-dom";


function MyProjects() {
  const { 
    loading,
    error,
    projects
  } = useUserProjects();

  if (loading) return <p className="text-center mt-10">Loading user projects...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  if (!projects.length) return <p className="text-center mt-10 text-gray-500">No projects found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto text-black">
      {projects.map((project) => (
        <div key={project.uuid} className="bg-white shadow-md rounded-xl p-4 border hover:shadow-lg transition">
          {project.bannerURI && (
            <img
              src={project.bannerURI}
              alt={`${project.name} banner`}
              className="w-full h-32 object-cover mb-4 rounded-t"
            />
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <img
                src={project.logoURI}
                alt={project.name}
                className="size-12 object-cover rounded-full border"
              />
              <div className="flex flex-col items-start -space-y-1">
                <h2 className="text-xl font-semibold mb-1">{project.name}</h2>
                <span className={`inline-block text-xs py-1 px-2 rounded ${
                  project.status === "PUBLISHED" ? "bg-green-100 text-green-800" :
                  project.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {project.status}
                </span>
              </div>
            </div>

            {/* Edit product */}
            <Link to={`/project/${project.name}/edit`}>Edit</Link>
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