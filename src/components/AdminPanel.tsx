"use client";

import { useState, useCallback, useEffect } from "react";
import {
  adminLogin,
  adminLogout,
  getAdminSession,
  getStaff,
  createStaff,
  removeStaff,
  getPendingUsers,
  updateSubmissionStatus,
  getVideo,
  getAudio,
  declineAllUserSubmissions,
  type AdminSession,
  type PendingUser,
  type SubmissionCapture,
} from "@/lib/adminData";
import { updateLeaderboard } from "@/data/leaderboard";

// ── Helpers ───────────────────────────────────────────────────────────────────
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
function avatarColor(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
function timeAgo(iso: string) {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return `${Math.floor(d)}s ago`;
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}
const DIFF_COLOR: Record<string, string> = {
  easy: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  medium: "text-amber-400   bg-amber-400/10   border-amber-400/20",
  extreme: "text-rose-400    bg-rose-400/10    border-rose-400/20",
};

// ── Admin Login Screen ────────────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: (s: AdminSession) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const session = adminLogin(email, password);
    if (session) {
      onLogin(session);
    } else {
      setError("Invalid credentials. Access denied.");
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 p-8">
      {/* Lock icon */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-400"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-white font-bold text-xl">Admin Access</h2>
          <p className="text-gray-500 text-sm mt-1">
            Codeif Control Panel
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}
        <div className="space-y-1">
          <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            Email
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors"
            placeholder="Enter admin email"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors"
            placeholder="Enter password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm"
        >
          {loading ? "Verifying…" : "Access Control Panel"}
        </button>
      </form>
      <p className="text-gray-700 text-xs">
        Press <kbd className="bg-gray-800 px-1 rounded">Ctrl+Shift+A</kbd> again
        to close
      </p>
    </div>
  );
}

// ── User Detail View ──────────────────────────────────────────────────────────
function UserDetail({
  user,
  onBack,
  onRefresh,
}: {
  user: PendingUser;
  onBack: () => void;
  onRefresh: () => void;
}) {
  const [actionMsg, setActionMsg] = useState<{
    id: string;
    msg: string;
  } | null>(null);
  const [videoUrls, setVideoUrls] = useState<Map<string, { camera?: string; screen?: string; audio?: string }>>(new Map());

  // Load videos from IndexedDB when component mounts
  useEffect(() => {
    const loadVideos = async () => {
      const urls = new Map<string, { camera?: string; screen?: string; audio?: string }>();
      for (const sub of user.submissions) {
        const cameraUrl = sub.hasCameraVideo ? await getVideo(sub.id, "camera") : undefined;
        const screenUrl = sub.hasScreenVideo ? await getVideo(sub.id, "screen") : undefined;
        const audioUrl = sub.hasAudio ? await getAudio(sub.id) : undefined;
        if (cameraUrl || screenUrl || audioUrl) {
          urls.set(sub.id, { camera: cameraUrl || undefined, screen: screenUrl || undefined, audio: audioUrl || undefined });
        }
      }
      setVideoUrls(urls);
    };
    loadVideos();
  }, [user.submissions]);

  function handleApprove(sub: SubmissionCapture) {
    updateSubmissionStatus(sub.id, "approved");
    
    // Update leaderboard with this submission
    const timeSpent = Math.floor((Date.now() - new Date(sub.submittedAt).getTime()) / 1000);
    updateLeaderboard(sub.userName, sub.userEmail, sub.difficulty as any, timeSpent);
    
    setActionMsg({
      id: sub.id,
      msg: `✓ Approved — ${sub.userName}'s rank updated in leaderboard.`,
    });
    setTimeout(() => {
      setActionMsg(null);
      onRefresh();
    }, 2000);
  }

  function handleDeny(sub: SubmissionCapture) {
    updateSubmissionStatus(sub.id, "denied");
    setActionMsg({
      id: sub.id,
      msg: `✗ Denied — Notification sent to ${sub.userEmail}: "There is a sense of cheating detected in your coding session. If you believe you are innocent, feel free to raise a ticket."`,
    });
    setTimeout(() => {
      setActionMsg(null);
      onRefresh();
    }, 3000);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-800 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full ${avatarColor(user.userName)} flex items-center justify-center text-white font-bold text-base`}
          >
            {user.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-white font-semibold">{user.userName}</div>
            <div className="text-gray-500 text-xs">{user.userEmail}</div>
          </div>
        </div>
        <span className="ml-auto text-xs bg-amber-400/10 border border-amber-400/20 text-amber-400 px-2.5 py-1 rounded-lg font-semibold">
          {user.submissions.length} Pending
        </span>
      </div>

      {/* Submissions */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {user.submissions.map((sub) => (
          <div
            key={sub.id}
            className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden"
          >
            {/* Submission header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800">
              <div>
                <div className="text-white font-semibold text-sm">
                  {sub.questionTitle}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded border ${DIFF_COLOR[sub.difficulty] ?? "text-gray-400"}`}
                  >
                    {sub.difficulty.charAt(0).toUpperCase() +
                      sub.difficulty.slice(1)}
                  </span>
                  <span className="text-gray-600 text-xs">{sub.language}</span>
                  <span className="text-gray-700 text-xs">
                    {timeAgo(sub.submittedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Code */}
            <div className="px-5 py-4 border-b border-gray-800">
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                Submitted Code
              </div>
              <pre className="text-xs text-gray-300 bg-[#1a1a1a] rounded-xl p-4 overflow-x-auto max-h-48 font-mono leading-relaxed whitespace-pre-wrap">
                {sub.code}
              </pre>
            </div>

            {/* Captures */}
            <div className="grid grid-cols-2 gap-4 px-5 py-4 border-b border-gray-800">
              {/* Camera */}
              <div>
                <div className="text-gray-500 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 7 16 12 23 17V7z" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                  Webcam
                </div>
                {videoUrls.get(sub.id)?.camera ? (
                  <video
                    src={videoUrls.get(sub.id)!.camera}
                    controls
                    className="w-full rounded-xl border border-gray-700 object-cover h-28"
                  />
                ) : sub.cameraSnapshot ? (
                  <img
                    src={sub.cameraSnapshot}
                    alt="Webcam"
                    className="w-full rounded-xl border border-gray-700 object-cover h-28"
                  />
                ) : (
                  <div className="w-full h-28 rounded-xl border border-gray-800 bg-gray-900 flex items-center justify-center">
                    <span className="text-gray-600 text-xs">
                      No capture available
                    </span>
                  </div>
                )}
                {videoUrls.get(sub.id)?.audio && (
                  <div className="mt-2">
                    <audio
                      src={videoUrls.get(sub.id)!.audio}
                      controls
                      className="w-full h-8"
                    />
                  </div>
                )}
              </div>
              {/* Screen */}
              <div>
                <div className="text-gray-500 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  Screen
                </div>
                {videoUrls.get(sub.id)?.screen ? (
                  <video
                    src={videoUrls.get(sub.id)!.screen}
                    controls
                    className="w-full rounded-xl border border-gray-700 object-cover h-28"
                  />
                ) : sub.screenSnapshot ? (
                  <img
                    src={sub.screenSnapshot}
                    alt="Screen"
                    className="w-full rounded-xl border border-gray-700 object-cover h-28"
                  />
                ) : (
                  <div className="w-full h-28 rounded-xl border border-gray-800 bg-gray-900 flex items-center justify-center">
                    <span className="text-gray-600 text-xs">
                      No capture available
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action message */}
            {actionMsg?.id === sub.id && (
              <div className="px-5 py-3 bg-gray-900 text-xs text-gray-300 leading-relaxed border-b border-gray-800">
                {actionMsg.msg}
              </div>
            )}

            {/* Approve / Deny - only if verified (has camera/screen video) */}
            {sub.hasCameraVideo || sub.hasScreenVideo ? (
              <div className="flex gap-3 px-5 py-4">
                <button
                  onClick={() => handleApprove(sub)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-400 text-sm font-semibold rounded-xl transition-colors"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Approve &amp; Rank
                </button>
                <button
                  onClick={() => handleDeny(sub)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-400 text-sm font-semibold rounded-xl transition-colors"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Deny &amp; Notify
                </button>
              </div>
            ) : (
              <div className="px-5 py-4 bg-gray-900/50 border border-gray-800">
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>Not eligible for leaderboard ranking — camera/screen sharing was not enabled</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Pending Approvals Tab ─────────────────────────────────────────────────────
function PendingApprovals({ session }: { session: AdminSession }) {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>(() =>
    getPendingUsers(),
  );
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [confirmDeclineUser, setConfirmDeclineUser] = useState<PendingUser | null>(null);

  const refresh = useCallback(() => {
    setPendingUsers(getPendingUsers());
    setSelectedUser(null);
  }, []);

  if (selectedUser) {
    return (
      <UserDetail
        user={selectedUser}
        onBack={() => setSelectedUser(null)}
        onRefresh={refresh}
      />
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-800 shrink-0">
        <h2 className="text-white font-bold text-lg">Pending Approvals</h2>
        <p className="text-gray-500 text-sm mt-1">
          {pendingUsers.length === 0
            ? "No pending submissions."
            : `${pendingUsers.length} user${pendingUsers.length > 1 ? "s" : ""} awaiting review`}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {pendingUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-600">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <p className="text-sm">All caught up! No pending submissions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {pendingUsers.map((u) => (
              <button
                key={u.userEmail}
                onClick={() => setSelectedUser(u)}
                className="bg-gray-900/60 border border-gray-800 hover:border-gray-600 rounded-2xl p-5 text-left transition-all hover:bg-gray-800/40 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-full ${avatarColor(u.userName)} flex items-center justify-center text-white font-bold text-lg shrink-0`}
                  >
                    {u.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-semibold truncate">
                      {u.userName}
                    </div>
                    <div className="text-gray-500 text-xs truncate">
                      {u.userEmail}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-amber-400/10 border border-amber-400/20 text-amber-400 px-2.5 py-1 rounded-lg font-semibold">
                    {u.submissions.length} pending
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeclineUser(u);
                      }}
                      className="text-xs text-[#7030E0] hover:text-[#8B4CFF] hover:bg-[#7030E0]/10 px-2 py-1 rounded-lg transition-colors"
                    >
                      Clear All
                    </button>
                    <span className="text-gray-600 group-hover:text-gray-400 text-xs transition-colors">
                      Review →
                    </span>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {u.submissions.slice(0, 2).map((s) => (
                    <div key={s.id} className="text-xs text-gray-600 truncate">
                      • {s.questionTitle}
                    </div>
                  ))}
                  {u.submissions.length > 2 && (
                    <div className="text-xs text-gray-700">
                      +{u.submissions.length - 2} more
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Confirmation Dialog */}
        {confirmDeclineUser && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-white font-bold text-lg mb-2">
                Clear All Pending Requests?
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Are you sure you want to decline all {confirmDeclineUser.submissions.length} pending submissions from {confirmDeclineUser.userName}? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDeclineUser(null)}
                  className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    declineAllUserSubmissions(confirmDeclineUser.userEmail);
                    setConfirmDeclineUser(null);
                    refresh();
                  }}
                  className="flex-1 px-4 py-2.5 bg-[#7030E0] hover:bg-[#8B4CFF] text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Decline All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Staff Management Tab (owner only) ─────────────────────────────────────────
function StaffManagement() {
  const [staff, setStaff] = useState(() => getStaff());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const err = createStaff(name, email, password);
    if (err) {
      setError(err);
      return;
    }
    setStaff(getStaff());
    setName("");
    setEmail("");
    setPassword("");
    setSuccess(`Staff account created for ${name}.`);
  }

  function handleRemove(staffEmail: string) {
    removeStaff(staffEmail);
    setStaff(getStaff());
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-800 shrink-0">
        <h2 className="text-white font-bold text-lg">Staff Management</h2>
        <p className="text-gray-500 text-sm mt-1">
          Only you (Babix) can create or remove staff accounts.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        {/* Create form */}
        <div>
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#7030E0]"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Create Staff Account
          </h3>
          <form
            onSubmit={handleCreate}
            className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 space-y-4"
          >
            {error && (
              <div className="text-sm text-red-400 bg-red-900/20 border border-red-500/30 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            {success && (
              <div className="text-sm text-emerald-400 bg-emerald-900/20 border border-emerald-500/30 px-4 py-3 rounded-xl">
                {success}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Full name"
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#7030E0] transition-colors"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                placeholder="Staff email"
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#7030E0] transition-colors"
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                placeholder="Password"
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#7030E0] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#7030E0] hover:bg-[#8B4CFF] text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Create Account
            </button>
          </form>
        </div>

        {/* Staff list */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Existing Staff ({staff.length})
          </h3>
          {staff.length === 0 ? (
            <p className="text-gray-600 text-sm">No staff accounts yet.</p>
          ) : (
            <div className="space-y-3">
              {staff.map((s) => (
                <div
                  key={s.email}
                  className="flex items-center gap-4 bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3"
                >
                  <div
                    className={`w-9 h-9 rounded-full ${avatarColor(s.name)} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                  >
                    {s.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium">
                      {s.name}
                    </div>
                    <div className="text-gray-500 text-xs">{s.email}</div>
                  </div>
                  <div className="text-gray-600 text-xs shrink-0">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => handleRemove(s.email)}
                    className="text-red-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors shrink-0"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Admin Dashboard ───────────────────────────────────────────────────────────
function AdminDashboard({
  session,
  onLogout,
}: {
  session: AdminSession;
  onLogout: () => void;
}) {
  const [tab, setTab] = useState<"approvals" | "staff">("approvals");

  const tabs = [
    {
      id: "approvals" as const,
      label: "Pending Approvals",
      icon: (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    ...(session.role === "owner"
      ? [
          {
            id: "staff" as const,
            label: "Staff Management",
            icon: (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 border-r border-gray-800 flex flex-col bg-gray-950 shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-800">
          <div className="flex items-center gap-0.5 mb-3">
            <img
              src="/l.png"
              alt="Codeif"
              className="h-14 w-auto object-contain mix-blend-screen"
            />
            <span className="text-xl font-bold text-[#F3F3F3]">
              Codeif
            </span>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center shrink-0">
              <svg
                width="9"
                height="9"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <span className="text-gray-400 text-xs font-medium tracking-wider uppercase">
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full ${avatarColor(session.name)} flex items-center justify-center text-white font-bold text-xs shrink-0`}
            >
              {session.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-white text-xs font-semibold truncate">
                {session.name}
              </div>
              <div className="text-gray-600 text-xs capitalize">
                {session.role}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                tab === t.id
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className={tab === t.id ? "text-red-400" : "text-gray-500"}>
                {t.icon}
              </span>
              {t.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl text-sm transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {tab === "approvals" && <PendingApprovals session={session} />}
        {tab === "staff" && <StaffManagement />}
      </div>
    </div>
  );
}

// ── Root AdminPanel ───────────────────────────────────────────────────────────
export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const [session, setSession] = useState<AdminSession | null>(() =>
    getAdminSession(),
  );

  function handleLogin(s: AdminSession) {
    setSession(s);
  }

  function handleLogout() {
    adminLogout();
    setSession(null);
  }

  return (
    <div className="fixed inset-0 z-[9999] flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative ml-auto w-full max-w-5xl h-full bg-[#0d0d0d] border-l border-gray-800 flex flex-col shadow-2xl shadow-black overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="flex-1 overflow-hidden">
          {session ? (
            <AdminDashboard session={session} onLogout={handleLogout} />
          ) : (
            <AdminLogin onLogin={handleLogin} />
          )}
        </div>
      </div>
    </div>
  );
}
