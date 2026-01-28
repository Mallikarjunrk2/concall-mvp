"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setSummary("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/summarize", {
      method: "POST",
      body: formData,
    });

  const data = await res.json();

if (!res.ok || !data.summary) {
  setSummary("❌ Failed to generate summary. Try a smaller PDF.");
} else {
  setSummary(data.summary);
}

setLoading(false);

  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Indian Concall Simplifier (MVP)
      </h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />
        <br />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading ? "Processing..." : "Upload & Simplify"}
        </button>
      </form>

      {summary && (
        <pre className="bg-gray-100 p-4 whitespace-pre-wrap rounded">
          {summary}
        </pre>
      )}
    </main>
  );
}
