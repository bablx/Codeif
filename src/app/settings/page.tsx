"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { getUser, saveUser } from "@/lib/adminData";

const AVATAR_COLORS = [
  "bg-[#7030E0]",
  "bg-violet-500",
  "bg-pink-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-sky-500",
  "bg-indigo-500",
];

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarColor, setAvatarColor] = useState("bg-[#7030E0]");
  const [bio, setBio] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const user = getUser();
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatar(user.avatar || user.name.charAt(0).toUpperCase());
      setAvatarColor(user.avatarColor || "bg-[#7030E0]");
      setBio(user.bio || "");
    }
  }, []);

  const handleSave = () => {
    saveUser(name, email, avatar, avatarColor, bio);
    setSaveMessage("Profile updated successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Settings
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Customize your profile and preferences
          </p>
        </div>

        {/* Settings Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8">
            {/* Avatar Preview */}
            <div className="flex flex-col items-center mb-8">
              <div className={`w-24 h-24 rounded-full ${avatarColor} flex items-center justify-center text-3xl font-bold mb-4`}>
                {avatar || name.charAt(0).toUpperCase()}
              </div>
              <p className="text-gray-400 text-sm">Profile Avatar</p>
            </div>

            {/* Avatar Character */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Avatar Character
              </label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                maxLength={1}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#7030E0]"
                placeholder="Enter a single character"
              />
            </div>

            {/* Avatar Color */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Avatar Color
              </label>
              <div className="flex flex-wrap gap-3">
                {AVATAR_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setAvatarColor(color)}
                    className={`w-10 h-10 rounded-full ${color} ${
                      avatarColor === color ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#7030E0]"
                placeholder="Enter your display name"
              />
            </div>

            {/* Email (Read-only) */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed"
                placeholder="Your email"
              />
              <p className="text-gray-500 text-xs mt-1">Email cannot be changed</p>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                maxLength={200}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#7030E0] resize-none"
                placeholder="Tell us about yourself..."
              />
              <p className="text-gray-500 text-xs mt-1">{bio.length}/200 characters</p>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full bg-[#7030E0] hover:bg-[#8B4CFF] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Save Changes
            </button>

            {/* Save Message */}
            {saveMessage && (
              <div className="mt-4 text-center text-emerald-400 text-sm">
                {saveMessage}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
