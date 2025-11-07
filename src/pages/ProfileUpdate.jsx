import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const ProfileUpdate = () => {
  const { user, updateUser } = useAuth();
  const [preview, setPreview] = useState(user?.profilePic || "");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return toast.warn("Please select an image first.");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/upload-profile-pic`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: preview }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Profile picture updated successfully!");
        updateUser({ ...user, profilePic: data.profilePic });
      } else {
        toast.error(data.message || "Failed to update profile picture.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Something went wrong while uploading.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-8">
      <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 w-full max-w-md shadow-[0_0_25px_-5px_rgba(99,102,241,0.3)] transition-all duration-300">
        <h1 className="text-3xl font-semibold mb-8 text-center text-indigo-400 tracking-wide">
          Update Your Profile
        </h1>

        <div className="flex flex-col items-center gap-6">
          {/* Profile Image Preview */}
          <div className="relative group">
            <img
              src={preview || `${API_BASE_URL}/Userimage.png`}
              alt="Profile Preview"
              className="w-32 h-32 rounded-full object-cover border-2 border-indigo-500 shadow-lg group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <span className="text-xs text-white font-medium">
                Change Image
              </span>
            </div>
          </div>

          {/* Upload Input */}
          <label className="w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="profile-pic-input"
            />
            <div className="cursor-pointer text-center border border-indigo-500/40 rounded-full py-2 px-4 text-sm font-medium text-indigo-300 hover:bg-indigo-600/20 transition-all duration-300">
              Choose Image
            </div>
          </label>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`mt-4 w-full py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-indigo-700/30"
            }`}
          >
            {loading ? "Uploading..." : "Upload Profile Picture"}
          </button>
        </div>

        <p className="text-center text-zinc-400 text-xs mt-6">
          Allowed formats: JPG, PNG, WEBP — up to 10MB.
        </p>
      </div>
    </div>
  );
};

export default ProfileUpdate;
