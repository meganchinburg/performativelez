"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="font-marker text-3xl sm:text-4xl text-pink-hot leading-tight">
          Bellingham
          <br />
          Performative Lesbian
          <br />
          Contest
        </h1>
        <p className="mt-3 text-sm text-purple-deep/70 font-display italic">
          Waterfront Skatepark · May 24 · 3 PM
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-4">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full py-4 px-5 rounded-2xl border-2 border-purple-light focus:border-purple-deep outline-none text-purple-deep font-semibold text-lg bg-white placeholder:text-purple-light/60"
          autoFocus
        />

        {error && (
          <p className="text-pink-hot text-sm font-semibold text-center">
            Wrong password — try again
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-pink-hot to-purple-deep text-white font-bold text-lg shadow-lg active:scale-95 transition-transform disabled:opacity-50"
        >
          {loading ? "Checking…" : "Enter"}
        </button>
      </form>

      <p className="mt-12 text-xs text-purple-light font-display italic text-center">
        &ldquo;We walked so you could cuff your jeans.&rdquo;
      </p>
    </main>
  );
}
