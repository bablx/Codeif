// ── Owner credentials (from environment variables) ───────────────────────────
export const OWNER_EMAIL    = process.env.NEXT_PUBLIC_OWNER_EMAIL || "";
export const OWNER_PASSWORD = process.env.NEXT_PUBLIC_OWNER_PASSWORD || "";
export const OWNER_NAME     = process.env.NEXT_PUBLIC_OWNER_NAME || "Admin";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface UserSession {
  name: string;
  email: string;
  avatar?: string;
  avatarColor?: string;
  bio?: string;
}

export interface UserAccount {
  email: string;
  password: string;
  name: string;
  createdAt: string;
  avatarColor?: string;
  bio?: string;
}

export interface StaffAccount {
  email: string;
  password: string;
  name: string;
  createdAt: string;
}

export interface AdminSession {
  email: string;
  name: string;
  role: "owner" | "staff";
}

export interface SubmissionCapture {
  id: string;
  userName: string;
  userEmail: string;
  questionId: number;
  questionTitle: string;
  difficulty: string;
  language: string;
  code: string;
  cameraSnapshot: string; // base64 jpeg (thumbnail)
  screenSnapshot: string; // base64 jpeg (thumbnail)
  hasCameraVideo: boolean; // video stored in IndexedDB
  hasScreenVideo: boolean; // video stored in IndexedDB
  hasAudio: boolean; // audio stored in IndexedDB
  submittedAt: string;
  status: "pending" | "approved" | "denied";
}

// ── Storage keys ──────────────────────────────────────────────────────────────
const K = {
  user:         "sf_user",
  users:        "sf_users",
  adminSession: "sf_admin_session",
  staff:        "sf_staff",
  submissions:  "sf_submissions",
} as const;

// ── IndexedDB for video storage ───────────────────────────────────────────────
const DB_NAME = "SkillCodeIfDB";
const DB_VERSION = 1;
const VIDEO_STORE = "videos";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(VIDEO_STORE)) {
        db.createObjectStore(VIDEO_STORE);
      }
    };
  });
}

export async function saveVideo(submissionId: string, type: "camera" | "screen", videoBlob: Blob): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const db = await openDB();
    const tx = db.transaction(VIDEO_STORE, "readwrite");
    const store = tx.objectStore(VIDEO_STORE);
    store.put(videoBlob, `${submissionId}_${type}`);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch (err) {
    console.error("Failed to save video to IndexedDB:", err);
  }
}

export async function saveAudio(submissionId: string, audioBlob: Blob): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const db = await openDB();
    const tx = db.transaction(VIDEO_STORE, "readwrite");
    const store = tx.objectStore(VIDEO_STORE);
    store.put(audioBlob, `${submissionId}_audio`);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch (err) {
    console.error("Failed to save audio to IndexedDB:", err);
  }
}

export async function getVideo(submissionId: string, type: "camera" | "screen"): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    const db = await openDB();
    const tx = db.transaction(VIDEO_STORE, "readonly");
    const store = tx.objectStore(VIDEO_STORE);
    const request = store.get(`${submissionId}_${type}`);
    const blob = await new Promise<Blob | undefined>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    db.close();
    if (blob) {
      return URL.createObjectURL(blob);
    }
    return null;
  } catch (err) {
    console.error("Failed to load video from IndexedDB:", err);
    return null;
  }
}

export async function getAudio(submissionId: string): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    const db = await openDB();
    const tx = db.transaction(VIDEO_STORE, "readonly");
    const store = tx.objectStore(VIDEO_STORE);
    const request = store.get(`${submissionId}_audio`);
    const blob = await new Promise<Blob | undefined>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    db.close();
    if (blob) {
      return URL.createObjectURL(blob);
    }
    return null;
  } catch (err) {
    console.error("Failed to load audio from IndexedDB:", err);
    return null;
  }
}

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ── User session ──────────────────────────────────────────────────────────────
export function saveUser(name: string, email: string, avatar?: string, avatarColor?: string, bio?: string) {
  write(K.user, { name, email, avatar, avatarColor, bio });
}

export function getUser(): UserSession | null {
  return read<UserSession>(K.user);
}

// ── Admin auth ────────────────────────────────────────────────────────────────
export function adminLogin(email: string, password: string): AdminSession | null {
  if (email === OWNER_EMAIL && password === OWNER_PASSWORD) {
    const s: AdminSession = { email, name: OWNER_NAME, role: "owner" };
    write(K.adminSession, s);
    return s;
  }
  const staff = getStaff();
  const found = staff.find((s) => s.email === email && s.password === password);
  if (found) {
    const s: AdminSession = { email, name: found.name, role: "staff" };
    write(K.adminSession, s);
    return s;
  }
  return null;
}

export function getAdminSession(): AdminSession | null {
  return read<AdminSession>(K.adminSession);
}

export function adminLogout() {
  if (typeof window !== "undefined") localStorage.removeItem(K.adminSession);
}

// ── Staff management (owner only) ─────────────────────────────────────────────
export function getStaff(): StaffAccount[] {
  return read<StaffAccount[]>(K.staff) ?? [];
}

export function createStaff(name: string, email: string, password: string): string | null {
  const staff = getStaff();
  if (staff.some((s) => s.email === email)) return "Staff with this email already exists.";
  staff.push({ email, password, name, createdAt: new Date().toISOString() });
  write(K.staff, staff);
  return null;
}

export function removeStaff(email: string) {
  write(K.staff, getStaff().filter((s) => s.email !== email));
}

// ── User account management ─────────────────────────────────────────────────────
export function getUsers(): UserAccount[] {
  return read<UserAccount[]>(K.users) ?? [];
}

export function createUser(name: string, email: string, password: string): string | null {
  const users = getUsers();
  if (users.some((u) => u.email === email)) return "User with this email already exists.";
  
  // Generate random avatar color
  const colors = ["bg-[#7030E0]", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500", "bg-purple-500", "bg-pink-500"];
  const avatarColor = colors[Math.floor(Math.random() * colors.length)];
  
  users.push({ 
    email, 
    password, 
    name, 
    createdAt: new Date().toISOString(),
    avatarColor
  });
  write(K.users, users);
  return null;
}

export function validateUser(email: string, password: string): UserAccount | null {
  const users = getUsers();
  return users.find((u) => u.email === email && u.password === password) ?? null;
}

// ── Submissions ───────────────────────────────────────────────────────────────
function seedMockSubmissions() {
  const existing = read<SubmissionCapture[]>(K.submissions);
  if (existing && existing.length > 0) return; // already seeded

  const mock: SubmissionCapture[] = [
    {
      id: "mock_1",
      userName: "Ram",
      userEmail: "ram@example.com",
      questionId: 1,
      questionTitle: "Two Sum",
      difficulty: "easy",
      language: "python",
      code: `from typing import List\n\nclass Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        seen = {}\n        for i, n in enumerate(nums):\n            if target - n in seen:\n                return [seen[target - n], i]\n            seen[n] = i\n        return []\n\nprint(Solution().twoSum([2,7,11,15], 9))`,
      cameraSnapshot: "",
      screenSnapshot: "",
      hasCameraVideo: false,
      hasScreenVideo: false,
      hasAudio: false,
      submittedAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
      status: "pending",
    },
    {
      id: "mock_2",
      userName: "Priya",
      userEmail: "priya@example.com",
      questionId: 6,
      questionTitle: "Maximum Subarray",
      difficulty: "easy",
      language: "javascript",
      code: `function maxSubArray(nums) {\n    let max = nums[0], cur = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        cur = Math.max(nums[i], cur + nums[i]);\n        max = Math.max(max, cur);\n    }\n    return max;\n}\nconsole.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]));`,
      cameraSnapshot: "",
      screenSnapshot: "",
      hasCameraVideo: false,
      hasScreenVideo: false,
      hasAudio: false,
      submittedAt: new Date(Date.now() - 5 * 3600_000).toISOString(),
      status: "pending",
    },
    {
      id: "mock_3",
      userName: "Sham",
      userEmail: "sham@example.com",
      questionId: 9,
      questionTitle: "Climbing Stairs",
      difficulty: "easy",
      language: "python",
      code: `class Solution:\n    def climbStairs(self, n: int) -> int:\n        a, b = 1, 2\n        for _ in range(n - 1):\n            a, b = b, a + b\n        return a\n\nprint(Solution().climbStairs(10))`,
      cameraSnapshot: "",
      screenSnapshot: "",
      hasCameraVideo: false,
      hasScreenVideo: false,
      hasAudio: false,
      submittedAt: new Date(Date.now() - 1 * 3600_000).toISOString(),
      status: "pending",
    },
    {
      id: "mock_4",
      userName: "Arjun",
      userEmail: "arjun@example.com",
      questionId: 101,
      questionTitle: "Longest Substring Without Repeating Characters",
      difficulty: "medium",
      language: "cpp",
      code: `#include <iostream>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        unordered_map<char,int> mp;\n        int res = 0, l = 0;\n        for (int r = 0; r < s.size(); r++) {\n            if (mp.count(s[r])) l = max(l, mp[s[r]] + 1);\n            mp[s[r]] = r;\n            res = max(res, r - l + 1);\n        }\n        return res;\n    }\n};\n\nint main() { cout << Solution().lengthOfLongestSubstring("abcabcbb"); }`,
      cameraSnapshot: "",
      screenSnapshot: "",
      hasCameraVideo: false,
      hasScreenVideo: false,
      hasAudio: false,
      submittedAt: new Date(Date.now() - 30 * 60_000).toISOString(),
      status: "pending",
    },
  ];

  write(K.submissions, mock);
}

export function getSubmissions(): SubmissionCapture[] {
  if (typeof window !== "undefined") seedMockSubmissions();
  return read<SubmissionCapture[]>(K.submissions) ?? [];
}

export function saveSubmission(sub: SubmissionCapture) {
  const subs = getSubmissions();
  subs.push(sub);
  write(K.submissions, subs);
}

export function updateSubmissionStatus(id: string, status: "approved" | "denied") {
  const subs = getSubmissions().map((s) => (s.id === id ? { ...s, status } : s));
  write(K.submissions, subs);
}

export function declineAllUserSubmissions(userEmail: string): number {
  const subs = getSubmissions().map((s) => 
    (s.userEmail === userEmail && s.status === "pending" ? { ...s, status: "denied" as const } : s)
  );
  write(K.submissions, subs);
  const declinedCount = subs.filter((s) => s.userEmail === userEmail && s.status === "denied").length;
  return declinedCount;
}

// Group pending submissions by user email
export interface PendingUser {
  userName: string;
  userEmail: string;
  submissions: SubmissionCapture[];
}

export function getPendingUsers(): PendingUser[] {
  const pending = getSubmissions().filter((s) => s.status === "pending");
  const map = new Map<string, PendingUser>();
  for (const sub of pending) {
    if (!map.has(sub.userEmail)) {
      map.set(sub.userEmail, { userName: sub.userName, userEmail: sub.userEmail, submissions: [] });
    }
    map.get(sub.userEmail)!.submissions.push(sub);
  }
  return Array.from(map.values());
}
