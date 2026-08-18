import { NextRequest, NextResponse } from "next/server";

const WANDBOX_URL = "https://wandbox.org/api/compile.json";

// Wandbox compiler ids — pinned to stable versions so behavior doesn't
// shift under us if Wandbox rotates their "-head" aliases.
const COMPILER_BY_LANGUAGE: Record<string, string> = {
  python: "cpython-3.12.7",
  javascript: "nodejs-20.17.0",
  cpp: "gcc-13.2.0",
  java: "openjdk-jdk-21+35",
};

export async function POST(req: NextRequest) {
  const { code, language } = await req.json();
  if (typeof code !== "string" || typeof language !== "string") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const compiler = COMPILER_BY_LANGUAGE[language];
  if (!compiler) {
    return NextResponse.json({ error: `Unsupported language: ${language}` }, { status: 400 });
  }

  const res = await fetch(WANDBOX_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, compiler }),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: `Execution service ${res.status}: ${text.slice(0, 200)}` },
      { status: res.status },
    );
  }

  const data = await res.json();
  const success = data.status === "0" && !data.compiler_error;
  return NextResponse.json({
    success,
    stdout: data.program_output ?? "",
    stderr: data.compiler_error || data.program_error || "",
  });
}
