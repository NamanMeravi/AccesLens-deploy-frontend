import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const CreateProject = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    name: "",
    url: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to create a project");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.name || !form.url || !form.description) {
      toast.error("All fields are required");
      return;
    }

    // Basic URL validation
    try {
      new URL(form.url);
    } catch (error) {
      toast.error("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: form.name.trim(),
          url: form.url.trim(),
          description: form.description.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Project created successfully!");
        // Navigate to home page after successful creation
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error(data.message || "Failed to create project");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Create project error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-8">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-lg w-full max-w-2xl space-y-6 border border-zinc-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-400 mb-2">Create New Project</h1>
          <p className="text-gray-400 text-sm">Add a new accessibility testing project</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Project Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter project name"
              className="w-full bg-zinc-800 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
              Website URL
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={form.url}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full bg-zinc-800 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter project description"
              rows="4"
              className="w-full bg-zinc-800 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              required
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 transition rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              disabled={loading}
              className="px-6 bg-zinc-800 hover:bg-zinc-700 transition rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;

