import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Sidebar = () => {
  const { isAuthenticated } = useAuth();
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecentProjects();
    }
  }, [isAuthenticated]);

  const fetchRecentProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/projects/get`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success && data.projects) {
        // Get the 5 most recent projects
        const recent = data.projects.slice(0, 5);
        setRecentProjects(recent);
      } else {
        setError("Failed to fetch projects");
      }
    } catch (err) {
      console.error("Error fetching recent projects:", err);
      setError("Error loading projects");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <aside className="hidden lg:block w-80 bg-zinc-900 border-r border-zinc-800 p-6 h-screen overflow-y-auto sticky top-0  ">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-indigo-400 mb-2">Recent Projects</h2>
        
      </div>
      <div className="mb-4">
        <Link
          to="/create-project"
          className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          New Project
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-zinc-800 rounded-lg p-4 animate-pulse"
            >
              <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-zinc-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400 text-sm">
          {error}
        </div>
      ) : recentProjects.length === 0 ? (
        <div className="bg-zinc-800 rounded-lg p-6 text-center">
          <p className="text-gray-400 text-sm">No projects yet</p>
          <Link
            to="/create-project"
            className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 inline-block"
          >
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {recentProjects.map((project) => (
            <Link
              key={project._id}
              to={`/dashboard/${project._id}`} // 👈 updated to use dashboard route
              className="block bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-indigo-500 rounded-lg p-4 transition-all duration-200 group"
               
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {project.name}
                </h3>
              </div>
              <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                {project.description}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    window.open(project.url, '_blank', 'noopener,noreferrer');
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 truncate max-w-[200px] cursor-pointer"
                >
                  {project.url}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(project.createdAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && recentProjects.length > 0 && (
        <div className="mt-6 pt-6 border-t border-zinc-800">
          
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

