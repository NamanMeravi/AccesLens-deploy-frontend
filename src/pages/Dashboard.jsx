import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState({
    name: "",
    description: "",
    url: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ✅ Fetch the project by ID
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (data.success && data.project) {
          setProject({
            name: data.project.name || "",
            description: data.project.description || "",
            url: data.project.url || "",
          });
        } else {
          toast.error("Project not found");
          navigate("/");
        }
      } catch (err) {
        toast.error("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  // ✅ Update project
  const handleUpdate = async () => {
    if (!project.name.trim() || !project.description.trim() || !project.url.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setUpdating(true);
      const res = await fetch(`${API_BASE_URL}/api/projects/update/${id}`, {
        method: "PUT", // ✅ use PUT since your backend supports it
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(project),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Project updated successfully");
        navigate("/");
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      toast.error("Update failed. Try again.");
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Loading state
  if (loading)
    return <div className="text-white p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 flex justify-center items-center">
      <div className="max-w-2xl w-full bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-800">
        <h1 className="text-3xl font-bold mb-6 text-indigo-400 text-center">
          Edit Project
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            value={project.name}
            onChange={(e) => setProject({ ...project, name: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Project Name"
          />
          <input
            type="url"
            value={project.url}
            onChange={(e) => setProject({ ...project, url: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Project URL"
          />
          <textarea
            value={project.description}
            onChange={(e) =>
              setProject({ ...project, description: e.target.value })
            }
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white h-40 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Project Description"
          ></textarea>

          <button
            onClick={handleUpdate}
            disabled={updating}
            className={`${
              updating ? "bg-indigo-800" : "bg-indigo-600 hover:bg-indigo-700"
            } px-6 py-3 rounded-lg font-semibold transition-colors w-full`}
          >
            {updating ? "Updating..." : "Update Project"}
          </button>

          <button
            onClick={() => navigate("/")}
            className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-lg font-semibold transition-colors w-full mt-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
