"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { Question, Difficulty } from "@/data/questions";
import type { QuestionDetails } from "@/data/questionDetails";
import { saveSubmission, getUser, saveVideo, saveAudio } from "@/lib/adminData";

// ── Monaco (dynamic to avoid SSR issues) ─────────────────────────────────────
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-[#1e1e1e]">
      <span className="w-5 h-5 border-2 border-[#7030E0]/40 border-t-[#7030E0] rounded-full animate-spin" />
    </div>
  ),
});

// ── Constants ─────────────────────────────────────────────────────────────────
interface Language {
  id: string;
  label: string;
  monacoId: string;
  pistonLang: string;
  pistonVersion: string;
}
const LANGUAGES: Language[] = [
  {
    id: "python",
    label: "Python 3",
    monacoId: "python",
    pistonLang: "python",
    pistonVersion: "3.10.0",
  },
  {
    id: "javascript",
    label: "JavaScript",
    monacoId: "javascript",
    pistonLang: "javascript",
    pistonVersion: "18.15.0",
  },
  {
    id: "cpp",
    label: "C++",
    monacoId: "cpp",
    pistonLang: "c++",
    pistonVersion: "10.2.0",
  },
  {
    id: "java",
    label: "Java",
    monacoId: "java",
    pistonLang: "java",
    pistonVersion: "15.0.2",
  },
];

type RunStatus = "idle" | "running" | "success" | "error";
type PermStatus = "pending" | "requesting" | "granted" | "denied";

interface RunResult {
  status: RunStatus;
  stdout: string;
  stderr: string;
  runtime?: number;
}

const DIFF_STYLE: Record<Difficulty, string> = {
  easy: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  medium: "text-amber-400   bg-amber-400/10   border-amber-400/20",
  extreme: "text-rose-400    bg-rose-400/10    border-rose-400/20",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function captureFrame(video: HTMLVideoElement, w = 1280, h = 720): string {
  const canvas = document.createElement("canvas");
  canvas.width = Math.min(video.videoWidth || w, w);
  canvas.height = Math.min(video.videoHeight || h, h);
  const ctx = canvas.getContext("2d");
  if (ctx && video.readyState >= 2)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.85);
}


// ── Permission Modal ───────────────────────────────────────────────────────────
function PermissionModal({
  status,
  onAllow,
  onDeny,
}: {
  status: PermStatus;
  onAllow: () => void;
  onDeny: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-black/60 w-full max-w-lg p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-amber-400"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">
              Competition Fairness Notice
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">
              Required for leaderboard eligibility
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
          <p>
            To maintain{" "}
            <span className="text-white font-semibold">
              fairness and authenticity
            </span>{" "}
            in the competition leaderboard, we request access to your{" "}
            <span className="text-[#7030E0] font-semibold">Camera</span> and{" "}
            <span className="text-[#7030E0] font-semibold">Screen Sharing</span>{" "}
            during coding sessions.
          </p>
          <p>
            This helps us verify submissions and ensure a{" "}
            <span className="text-white font-semibold">
              transparent competitive environment
            </span>{" "}
            for all participants.
          </p>

          {/* Info box */}
          <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-4 space-y-2">
            <div className="flex items-start gap-2 text-amber-300 text-xs">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 mt-0.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>
                Granting these permissions is{" "}
                <strong>completely optional.</strong> However, participants who
                choose not to enable Camera or Screen Sharing will{" "}
                <strong>not be eligible for leaderboard rankings</strong> or
                verified competition status.
              </span>
            </div>
          </div>

          {/* What we capture */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#7030E0]/10 flex items-center justify-center shrink-0">
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
                  <path d="M23 7 16 12 23 17V7z" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </div>
              <div>
                <div className="text-white text-xs font-semibold">Webcam</div>
                <div className="text-gray-500 text-xs">
                  Live feed during session
                </div>
              </div>
            </div>
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-400/10 flex items-center justify-center shrink-0">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-violet-400"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <div>
                <div className="text-white text-xs font-semibold">Screen</div>
                <div className="text-gray-500 text-xs">Captured on submit</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onAllow}
            disabled={status === "requesting"}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#7030E0] hover:bg-[#8B4CFF] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
          >
            {status === "requesting" ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Requesting access…
              </>
            ) : (
              <>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Allow Camera &amp; Screen — Compete for Rankings
              </>
            )}
          </button>
          <button
            onClick={onDeny}
            disabled={status === "requesting"}
            className="w-full py-3 text-gray-400 hover:text-gray-200 text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
          >
            Skip — Code without leaderboard ranking
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Submit Result Modal ────────────────────────────────────────────────────────
function SubmitModal({
  verified,
  onClose,
}: {
  verified: boolean;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-sm p-7 flex flex-col items-center gap-5 text-center">
        {verified ? (
          <>
            <div className="w-14 h-14 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-emerald-400"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                Submission Recorded
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Your code has been submitted with verification data and is
                eligible for leaderboard ranking.
              </p>
            </div>
            <div className="w-full bg-gray-800 rounded-xl p-4 space-y-2 text-left">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  ✓
                </span>
                Camera snapshot captured
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  ✓
                </span>
                Screen capture captured
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  ✓
                </span>
                Queued for admin verification
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-amber-400"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Code Submitted</h3>
              <p className="text-gray-400 text-sm mt-1">
                Your code was submitted successfully.
              </p>
            </div>
            <div className="w-full bg-amber-400/5 border border-amber-400/20 rounded-xl p-4">
              <div className="flex items-start gap-2 text-xs text-amber-300">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 mt-0.5"
                >
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>
                  <strong>Not eligible for leaderboard ranking.</strong>
                  <br />
                  Camera and screen sharing were not enabled. Enable them next
                  time to compete.
                </span>
              </div>
            </div>
          </>
        )}
        <div className="flex gap-3 w-full">
          <Link
            href="/dashboard"
            className="flex-1 py-2.5 text-center bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-xl transition-colors"
          >
            Dashboard
          </Link>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-[#7030E0] hover:bg-[#8B4CFF] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Continue Coding
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Problem Panel ─────────────────────────────────────────────────────────────
function ProblemPanel({
  question,
  details,
}: {
  question: Question;
  details: QuestionDetails;
}) {
  function renderText(text: string) {
    return text.split(/(\*\*[^*]+\*\*|`[^`]+`|\n)/g).map((p, i) => {
      if (p.startsWith("**") && p.endsWith("**"))
        return (
          <strong key={i} className="text-white font-semibold">
            {p.slice(2, -2)}
          </strong>
        );
      if (p.startsWith("`") && p.endsWith("`"))
        return (
          <code
            key={i}
            className="bg-gray-800 text-[#7030E0] px-1 py-0.5 rounded text-xs font-mono"
          >
            {p.slice(1, -1)}
          </code>
        );
      if (p === "\n") return <br key={i} />;
      return <span key={i}>{p}</span>;
    });
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-6 text-sm leading-relaxed">
      <h1 className="text-lg font-bold text-white mb-2">{question.title}</h1>
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded border ${DIFF_STYLE[question.difficulty]}`}
        >
          {question.difficulty.charAt(0).toUpperCase() +
            question.difficulty.slice(1)}
        </span>
        <span className="text-gray-600 text-xs">{question.topic}</span>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-6">
        {question.tags.map((t) => (
          <span
            key={t}
            className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="text-gray-300 mb-7">
        {renderText(details.description)}
      </div>

      {/* Examples */}
      <h3 className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-3">
        Examples
      </h3>
      <div className="space-y-4 mb-7">
        {details.examples.map((ex, i) => (
          <div
            key={i}
            className="bg-gray-900/70 border border-gray-800 rounded-lg p-4 font-mono text-xs space-y-1.5"
          >
            <div>
              <span className="text-gray-500">Input: </span>
              <span className="text-gray-200">{ex.input}</span>
            </div>
            <div>
              <span className="text-gray-500">Output: </span>
              <span className="text-emerald-300">{ex.output}</span>
            </div>
            {ex.explanation && (
              <div className="text-gray-500 pt-1 border-t border-gray-800 mt-2">
                {ex.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Constraints */}
      <h3 className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-3">
        Constraints
      </h3>
      <ul className="space-y-1.5">
        {details.constraints.map((c, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-gray-400 text-xs font-mono"
          >
            <span className="text-[#7030E0] mt-0.5 shrink-0">•</span>
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Console Panel ─────────────────────────────────────────────────────────────
function ConsolePanel({
  result,
  isOpen,
  onToggle,
}: {
  result: RunResult | null;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const statusColor = {
    idle: "text-gray-500",
    running: "text-[#7030E0]",
    success: "text-emerald-400",
    error: "text-rose-400",
  };
  const statusLabel = {
    idle: "Console",
    running: "Running…",
    success: "Success",
    error: "Runtime Error",
  };

  return (
    <div
      className={`flex flex-col border-t border-gray-800 bg-gray-950 transition-all duration-200 ${isOpen ? "h-52" : "h-10"}`}
    >
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 h-10 shrink-0 w-full text-left hover:bg-gray-900 transition-colors"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 text-gray-500 ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
        <span
          className={`text-xs font-semibold ${result ? statusColor[result.status] : "text-gray-500"}`}
        >
          {result ? statusLabel[result.status] : "Console"}
        </span>
        {result?.runtime && (
          <span className="ml-auto text-xs text-gray-600">
            {result.runtime}ms
          </span>
        )}
      </button>
      {isOpen && (
        <div className="flex-1 overflow-y-auto px-4 pb-4 font-mono text-xs">
          {!result && (
            <p className="text-gray-600 mt-2">
              Run your code to see output here.
            </p>
          )}
          {result?.status === "running" && (
            <div className="flex items-center gap-2 text-[#7030E0] mt-2">
              <span className="w-3 h-3 border border-[#7030E0] border-t-transparent rounded-full animate-spin" />{" "}
              Executing…
            </div>
          )}
          {result && result.status !== "running" && (
            <div className="mt-2 space-y-2">
              {result.stdout && (
                <div>
                  <span className="text-gray-600">stdout</span>
                  <pre className="text-emerald-300 whitespace-pre-wrap break-words mt-1">
                    {result.stdout}
                  </pre>
                </div>
              )}
              {result.stderr && (
                <div>
                  <span className="text-gray-600">stderr</span>
                  <pre className="text-rose-400 whitespace-pre-wrap break-words mt-1">
                    {result.stderr}
                  </pre>
                </div>
              )}
              {!result.stdout && !result.stderr && (
                <p className="text-gray-600">No output produced.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Workspace ────────────────────────────────────────────────────────────
export default function CodeWorkspace({
  question,
  details,
}: {
  question: Question;
  details: QuestionDetails;
}) {
  const [lang, setLang] = useState<Language>(LANGUAGES[0]);
  const [code, setCode] = useState(details.starterCode[LANGUAGES[0].id] ?? "");
  const [result, setResult] = useState<RunResult | null>(null);
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  // Permission & media
  const [permStatus, setPermStatus] = useState<PermStatus>("pending");
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const cameraRecorderRef = useRef<MediaRecorder | null>(null);
  const screenRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const cameraChunksRef = useRef<Blob[]>([]);
  const screenChunksRef = useRef<Blob[]>([]);
  const audioChunksRef = useRef<Blob[]>([]);

  // Submit modal
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitVerified, setSubmitVerified] = useState(false);
  const [skipLeaderboard, setSkipLeaderboard] = useState(false);

  // Attach streams to video elements and start recording
  useEffect(() => {
    if (cameraStream && cameraVideoRef.current) {
      cameraVideoRef.current.srcObject = cameraStream;
      cameraVideoRef.current.play().catch(() => {});

      // Start recording camera (with audio)
      try {
        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
          ? 'video/webm;codecs=vp9' 
          : MediaRecorder.isTypeSupported('video/webm') 
            ? 'video/webm' 
            : '';
        const recorder = new MediaRecorder(cameraStream, mimeType ? { mimeType } : undefined);
        cameraChunksRef.current = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            cameraChunksRef.current.push(e.data);
          }
        };
        recorder.start(1000); // Capture chunks every second
        cameraRecorderRef.current = recorder;
      } catch (err) {
        console.error('Failed to start camera recorder:', err);
      }

      // Start recording audio separately
      try {
        const audioStream = cameraStream.clone();
        const audioTracks = audioStream.getAudioTracks();
        if (audioTracks.length > 0) {
          const audioOnlyStream = new MediaStream(audioTracks);
          const audioMimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
          const audioRecorder = new MediaRecorder(audioOnlyStream, audioMimeType ? { mimeType: audioMimeType } : undefined);
          audioChunksRef.current = [];
          audioRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              audioChunksRef.current.push(e.data);
            }
          };
          audioRecorder.start(1000); // Capture chunks every second
          audioRecorderRef.current = audioRecorder;
        }
      } catch (err) {
        console.error('Failed to start audio recorder:', err);
      }
    }
    return () => {
      if (cameraRecorderRef.current && cameraRecorderRef.current.state === 'recording') {
        cameraRecorderRef.current.stop();
      }
      if (audioRecorderRef.current && audioRecorderRef.current.state === 'recording') {
        audioRecorderRef.current.stop();
      }
    };
  }, [cameraStream]);

  useEffect(() => {
    if (screenStream && screenVideoRef.current) {
      screenVideoRef.current.srcObject = screenStream;
      screenVideoRef.current.play().catch(() => {});

      // Start recording screen
      try {
        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
          ? 'video/webm;codecs=vp9' 
          : MediaRecorder.isTypeSupported('video/webm') 
            ? 'video/webm' 
            : '';
        const recorder = new MediaRecorder(screenStream, mimeType ? { mimeType } : undefined);
        screenChunksRef.current = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            screenChunksRef.current.push(e.data);
          }
        };
        recorder.start(1000); // Capture chunks every second
        screenRecorderRef.current = recorder;
      } catch (err) {
        console.error('Failed to start screen recorder:', err);
      }
    }
    return () => {
      if (screenRecorderRef.current && screenRecorderRef.current.state === 'recording') {
        screenRecorderRef.current.stop();
      }
    };
  }, [screenStream]);

  // Cleanup streams on unmount
  useEffect(() => {
    return () => {
      cameraStream?.getTracks().forEach((t) => t.stop());
      screenStream?.getTracks().forEach((t) => t.stop());
    };
  }, [cameraStream, screenStream]);

  // ── Permission handlers ─────────────────────────────────────────────────────
  const handleAllow = useCallback(async () => {
    setPermStatus("requesting");
    try {
      const cam = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const scr = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      setCameraStream(cam);
      setScreenStream(scr);

      // If user stops screen share via browser UI, mark as denied
      scr.getVideoTracks()[0]?.addEventListener("ended", () => {
        setPermStatus("denied");
        setScreenStream(null);
      });

      setPermStatus("granted");
    } catch {
      // User denied browser permission dialog
      setPermStatus("denied");
    }
  }, []);

  const handleDeny = useCallback(() => {
    setPermStatus("denied");
  }, []);

  // ── Run code ────────────────────────────────────────────────────────────────
  const runCode = useCallback(async () => {
    setResult({ status: "running", stdout: "", stderr: "" });
    setConsoleOpen(true);
    const t0 = Date.now();
    try {
      const res = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: lang.pistonLang,
          version: lang.pistonVersion,
          files: [{ name: "main", content: code }],
        }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      const run = data.run ?? {};
      setResult({
        status: (run.code ?? 0) === 0 ? "success" : "error",
        stdout: (run.stdout ?? "").trimEnd(),
        stderr: (run.stderr ?? "").trimEnd(),
        runtime: Date.now() - t0,
      });
    } catch (err) {
      setResult({
        status: "error",
        stdout: "",
        stderr: String(err),
        runtime: Date.now() - t0,
      });
    }
  }, [code, lang]);

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    const verified = permStatus === "granted";
    const sessionUser = getUser();

    let camCapture = "";
    let scrCapture = "";
    let hasCamVideo = false;
    let hasScrVideo = false;
    let hasAudio = false;
    const submissionId = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    if (verified && cameraVideoRef.current && screenVideoRef.current) {
      // Use small thumbnails to keep localStorage size manageable
      camCapture = captureFrame(cameraVideoRef.current, 320, 240);
      scrCapture = captureFrame(screenVideoRef.current, 640, 360);

      // Stop recording and save video blobs to IndexedDB
      if (cameraRecorderRef.current && cameraRecorderRef.current.state === 'recording') {
        cameraRecorderRef.current.stop();
        await new Promise<void>((resolve) => {
          cameraRecorderRef.current!.onstop = () => resolve();
        });
        const camBlob = new Blob(cameraChunksRef.current, { type: 'video/webm' });
        await saveVideo(submissionId, "camera", camBlob);
        hasCamVideo = true;
      }

      if (screenRecorderRef.current && screenRecorderRef.current.state === 'recording') {
        screenRecorderRef.current.stop();
        await new Promise<void>((resolve) => {
          screenRecorderRef.current!.onstop = () => resolve();
        });
        const scrBlob = new Blob(screenChunksRef.current, { type: 'video/webm' });
        await saveVideo(submissionId, "screen", scrBlob);
        hasScrVideo = true;
      }

      // Stop recording and save audio blob to IndexedDB
      if (audioRecorderRef.current && audioRecorderRef.current.state === 'recording') {
        audioRecorderRef.current.stop();
        await new Promise<void>((resolve) => {
          audioRecorderRef.current!.onstop = () => resolve();
        });
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await saveAudio(submissionId, audioBlob);
        hasAudio = true;
      }
    }

    // Only save to admin panel if user didn't skip leaderboard
    if (!skipLeaderboard) {
      saveSubmission({
        id: submissionId,
        userName: sessionUser?.name ?? "Anonymous",
        userEmail: sessionUser?.email ?? "unknown@user.com",
        questionId: question.id,
        questionTitle: question.title,
        difficulty: question.difficulty,
        language: lang.id,
        code,
        cameraSnapshot: camCapture,
        screenSnapshot: scrCapture,
        hasCameraVideo: hasCamVideo,
        hasScreenVideo: hasScrVideo,
        hasAudio: hasAudio,
        submittedAt: new Date().toISOString(),
        status: "pending",
      });
    }

    setSubmitVerified(verified);
    setShowSubmit(true);
  }, [
    permStatus,
    question.id,
    question.title,
    question.difficulty,
    lang.id,
    code,
    skipLeaderboard,
  ]);

  const changeLang = useCallback(
    (l: Language) => {
      setLang(l);
      setCode(details.starterCode[l.id] ?? "");
      setResult(null);
      setLangMenuOpen(false);
    },
    [details.starterCode],
  );

  return (
    <div className="h-screen bg-[#0d0d0d] text-white flex flex-col overflow-hidden relative">
      {/* ── Permission modal (shown first) ──────────────────────────────── */}
      {permStatus === "pending" || permStatus === "requesting" ? (
        <PermissionModal
          status={permStatus}
          onAllow={handleAllow}
          onDeny={handleDeny}
        />
      ) : null}

      {/* ── Submit result modal ──────────────────────────────────────────── */}
      {showSubmit && (
        <SubmitModal
          verified={submitVerified}
          onClose={() => setShowSubmit(false)}
        />
      )}

      {/* Hidden video elements for capture */}
      <video ref={screenVideoRef} className="hidden" muted playsInline />

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header className="flex items-center gap-3 px-4 h-14 border-b border-gray-800 bg-gray-950 shrink-0 z-10">
        <Link
          href="/dashboard"
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
          <span className="hidden sm:inline">Back</span>
        </Link>
        <div className="w-px h-6 bg-gray-800" />

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="font-semibold text-white truncate text-sm">
            {question.title}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded border shrink-0 ${DIFF_STYLE[question.difficulty]}`}
          >
            {question.difficulty.charAt(0).toUpperCase() +
              question.difficulty.slice(1)}
          </span>
        </div>

        {/* Verified / unverified badge */}
        {permStatus !== "pending" && permStatus !== "requesting" && (
          <div
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border shrink-0 ${
              permStatus === "granted"
                ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                : "text-amber-400 bg-amber-400/10 border-amber-400/20"
            }`}
          >
            {permStatus === "granted" ? (
              <>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>{" "}
                Verified
              </>
            ) : (
              <>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>{" "}
                No Ranking
              </>
            )}
          </div>
        )}

        {/* Language selector */}
        <div className="relative shrink-0">
          <button
            onClick={() => setLangMenuOpen((v) => !v)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm hover:bg-gray-700 transition-colors"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#7030E0]"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            {lang.label}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`text-gray-500 transition-transform ${langMenuOpen ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          {langMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
              {LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => changeLang(l)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                    l.id === lang.id
                      ? "text-[#7030E0] bg-[#7030E0]/10"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${l.id === lang.id ? "bg-[#7030E0]" : ""}`}
                  />
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Run */}
        <button
          onClick={runCode}
          disabled={result?.status === "running"}
          className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors shrink-0"
        >
          {result?.status === "running" ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />{" "}
              Running
            </>
          ) : (
            <>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>{" "}
              Run
            </>
          )}
        </button>

        {/* Skip Leaderboard Toggle */}
        <label className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-lg transition-colors cursor-pointer shrink-0 border border-gray-700">
          <input
            type="checkbox"
            checked={skipLeaderboard}
            onChange={(e) => setSkipLeaderboard(e.target.checked)}
            className="w-3 h-3 rounded border-gray-600 text-[#7030E0] focus:ring-[#7030E0] focus:ring-offset-gray-900"
          />
          Skip Leaderboard
        </label>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-4 py-1.5 bg-[#7030E0] hover:bg-[#8B4CFF] text-white text-sm font-semibold rounded-lg transition-colors shrink-0"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Submit
        </button>
      </header>

      {/* ── Main split pane ──────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Problem description */}
        <div className="w-[38%] min-w-[260px] border-r border-gray-800 flex flex-col overflow-hidden bg-[#111]">
          <ProblemPanel question={question} details={details} />
        </div>

        {/* Editor + console */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Camera preview (when granted) */}
          {permStatus === "granted" && cameraStream && (
            <div className="absolute bottom-[212px] right-3 z-20 rounded-xl overflow-hidden border-2 border-gray-700 shadow-xl shadow-black/60 w-36 h-24 bg-gray-900">
              <video
                ref={cameraVideoRef}
                className="w-full h-full object-cover"
                muted
                playsInline
                autoPlay
              />
              <div className="absolute top-1 left-1 flex items-center gap-1 bg-black/60 rounded px-1.5 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white text-[10px] font-medium">LIVE</span>
              </div>
            </div>
          )}

          {/* Monaco editor */}
          <div className="flex-1 overflow-hidden">
            <MonacoEditor
              height="100%"
              language={lang.monacoId}
              value={code}
              onChange={(v) => setCode(v ?? "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily:
                  "'JetBrains Mono','Fira Code','Cascadia Code',Consolas,monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                renderLineHighlight: "line",
                roundedSelection: true,
                automaticLayout: true,
                tabSize: 4,
                wordWrap: "on",
                padding: { top: 16 },
                quickSuggestions: true,
                folding: true,
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>

          {/* Console */}
          <ConsolePanel
            result={result}
            isOpen={consoleOpen}
            onToggle={() => setConsoleOpen((v) => !v)}
          />
        </div>
      </div>
    </div>
  );
}
