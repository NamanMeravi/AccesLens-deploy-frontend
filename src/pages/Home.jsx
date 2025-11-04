import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/projects/get`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success && data.projects) {
        setProjects(data.projects);
      } else {
        setError("Failed to fetch projects");
        toast.error(data.message || "Failed to load projects");
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Error loading projects");
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchProjects();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/projects/search?query=${encodeURIComponent(searchQuery)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success && data.projects) {
        setProjects(data.projects);
      } else {
        toast.error(data.message || "Search failed");
      }
    } catch (err) {
      console.error("Error searching projects:", err);
      toast.error("Search error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // 👇 Navigate to dashboard page when a card is clicked
  const handleCardClick = (id) => {
    navigate(`/dashboard/${id}`);
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      {/* Sidebar */}
      <div className="mt-16">
        {/* 👇 This ensures Sidebar starts below the fixed Navbar */}
        <Sidebar />
      </div>
  
      {/* Main Content */}
      <main className="flex-1 pt-24 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              All Projects
            </h1>
            <p className="text-gray-400">Manage your projects</p>
          </div>
  
          {/* Search Bar */}
          {isAuthenticated && (
            <div className="mb-6 flex gap-2">
              <input
                type="text"
                placeholder="Search projects by name, URL, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleSearch}
                className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
              >
                Search
              </button>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    fetchProjects();
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          )}
  
          {/* Not Authenticated Message */}
          {!isAuthenticated && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4 text-indigo-400">
                Welcome to Access-pally
              </h2>
              <p className="text-gray-400 mb-6">
                Please log in to view and manage your accessibility testing projects.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  to="/login"
                  className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
  
          {/* Loading State */}
          {isAuthenticated && loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 animate-pulse"
                >
                  <div className="h-6 bg-zinc-800 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-zinc-800 rounded w-full mb-2"></div>
                  <div className="h-4 bg-zinc-800 rounded w-5/6 mb-4"></div>
                  <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          )}
  
          {/* Error State */}
          {isAuthenticated && !loading && error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchProjects}
                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Retry
              </button>
            </div>
          )}
  
          {/* Empty State */}
          {isAuthenticated && !loading && !error && projects.length === 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-2xl font-semibold mb-2 text-indigo-400">
                No Projects Found
              </h3>
              <p className="text-gray-400 mb-6">
                {searchQuery
                  ? "No projects match your search query."
                  : "Get started by creating your first accessibility testing project."}
              </p>
              <Link
                to="/create-project"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Create Project
              </Link>
            </div>
          )}
  
          {/* Projects Grid */}
          {isAuthenticated && !loading && !error && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => handleCardClick(project._id)} // navigate on click
                  className="bg-zinc-900 border border-zinc-800 hover:border-indigo-500 rounded-lg p-6 transition-all duration-200 group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {project.name}
                    </h3>
                  </div>
  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>
  
                  <div className="mb-4">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-400 hover:text-indigo-300 break-all"
                      onClick={(e) => e.stopPropagation()} // prevent full card click
                    >
                      {project.url}
                    </a>
                  </div>
  
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                    <span className="text-xs text-gray-500">
                      {formatDate(project.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
  
};

export default Home;
