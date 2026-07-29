"use client";

import { useState, useEffect, useRef } from "react";
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

const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2MB

type Tab = "profile" | "account" | "preferences";

const TABS: { id: Tab; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "account", label: "Account" },
  { id: "preferences", label: "Preferences" },
];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("profile");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarColor, setAvatarColor] = useState("bg-[#7030E0]");
  const [avatarImage, setAvatarImage] = useState<string | undefined>(undefined);
  const [bio, setBio] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [defaultDifficulty, setDefaultDifficulty] = useState<"easy" | "medium" | "extreme">("easy");
  const [clearMessage, setClearMessage] = useState("");

  useEffect(() => {
    const user = getUser();
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatar(user.avatar || user.name.charAt(0).toUpperCase());
      setAvatarColor(user.avatarColor || "bg-[#7030E0]");
      setAvatarImage(user.avatarImage);
      setBio(user.bio || "");
    }
    try {
      const pref = localStorage.getItem("sf_pref_difficulty");
      if (pref === "easy" || pref === "medium" || pref === "extreme") setDefaultDifficulty(pref);
    } catch { /* ignore */ }
  }, []);

  function handleAvatarFile(file: File) {
    setAvatarError("");
    if (!file.type.startsWith("image/")) {
      setAvatarError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError("Image must be under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatarImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  const handleSave = () => {
    saveUser(name, email, avatar, avatarColor, bio, avatarImage);
    try {
      const existing = JSON.parse(localStorage.getItem("sf_user") || "{}");
      localStorage.setItem("sf_user", JSON.stringify({ ...existing, name, email, avatarColor, avatarImage }));
    } catch { /* ignore */ }
    setSaveMessage("Profile updated successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleDifficultyChange = (diff: "easy" | "medium" | "extreme") => {
    setDefaultDifficulty(diff);
    try { localStorage.setItem("sf_pref_difficulty", diff); } catch { /* ignore */ }
  };

  const handleClearProgress = () => {
    try {
      localStorage.removeItem("sf_solved");
      setClearMessage("Local progress cleared.");
      setTimeout(() => setClearMessage(""), 3000);
    } catch { /* ignore */ }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="mb-8">
          <a href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#7030E0] transition-colors text-sm mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </a>
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Settings</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Customize your profile and preferences</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Category tabs */}
          <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1 w-fit mx-auto mb-6">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-5 py-2 rounded-md text-sm font-semibold transition-all duration-150 ${
                  tab === t.id
                    ? "bg-gray-800 text-[#7030E0] shadow"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8">
            {tab === "profile" && (
              <>
                {/* Avatar Preview */}
                <div className="flex flex-col items-center mb-8">
                  <div className={`relative w-24 h-24 rounded-full ${avatarColor} flex items-center justify-center text-3xl font-bold mb-4 overflow-hidden`}>
                    {avatarImage ? (
                      <img src={avatarImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      avatar || name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm text-[#7030E0] border border-[#7030E0]/30 px-4 py-1.5 rounded-lg hover:bg-[#7030E0]/10 transition-colors"
                    >
                      Upload Photo
                    </button>
                    {avatarImage && (
                      <button
                        onClick={() => setAvatarImage(undefined)}
                        className="text-sm text-gray-500 hover:text-red-400 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAvatarFile(file);
                      e.target.value = "";
                    }}
                  />
                  {avatarError && <p className="text-red-400 text-xs mt-2">{avatarError}</p>}
                  <p className="text-gray-500 text-sm mt-2">
                    {avatarImage ? "Custom photo in use" : "No photo uploaded — using character + color below"}
                  </p>
                </div>

                {/* Avatar Character (fallback) */}
                <div className={`mb-6 transition-opacity ${avatarImage ? "opacity-40 pointer-events-none" : ""}`}>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Fallback Character
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

                {/* Avatar Color (fallback) */}
                <div className={`mb-6 transition-opacity ${avatarImage ? "opacity-40 pointer-events-none" : ""}`}>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Fallback Color
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

                <button
                  onClick={handleSave}
                  className="w-full bg-[#7030E0] hover:bg-[#8B4CFF] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Save Changes
                </button>

                {saveMessage && (
                  <div className="mt-4 text-center text-emerald-400 text-sm">
                    {saveMessage}
                  </div>
                )}
              </>
            )}

            {tab === "account" && (
              <>
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

                <div className="border-t border-gray-800 pt-6 mt-6">
                  <h3 className="text-red-400 font-semibold text-sm mb-1">Danger Zone</h3>
                  <p className="text-gray-500 text-xs mb-4">
                    Clears your locally tracked solved-question history on this device. Leaderboard entries are not affected.
                  </p>
                  <button
                    onClick={handleClearProgress}
                    className="border border-red-500/30 text-red-400 hover:bg-red-500/10 font-semibold py-2.5 px-5 rounded-lg transition-colors text-sm"
                  >
                    Clear Local Progress
                  </button>
                  {clearMessage && (
                    <div className="mt-3 text-emerald-400 text-sm">{clearMessage}</div>
                  )}
                </div>
              </>
            )}

            {tab === "preferences" && (
              <>
                <div className="mb-2">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Default Difficulty
                  </label>
                  <p className="text-gray-500 text-xs mb-3">
                    Which tab the Stack page opens to by default.
                  </p>
                  <div className="flex items-center gap-2">
                    {(["easy", "medium", "extreme"] as const).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => handleDifficultyChange(diff)}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize border transition-colors ${
                          defaultDifficulty === diff
                            ? "bg-[#7030E0]/10 text-[#7030E0] border-[#7030E0]/30"
                            : "text-gray-400 border-gray-700 hover:text-gray-200"
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
