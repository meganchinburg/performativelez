"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { DEFAULT_CATEGORIES, type Category } from "../lib/categories";

type Step = "judge" | "contestant" | "scoring" | "submitted";

export default function JudgePage() {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [step, setStep] = useState<Step>("judge");
  const [judgeNum, setJudgeNum] = useState<number>(0);
  const [contestantNum, setContestantNum] = useState<string>("");
  const [scores, setScores] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [scoredList, setScoredList] = useState<
    { contestant: number; total: number }[]
  >([]);
  const [error, setError] = useState("");

  // Fetch categories on mount
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data.categories);
        setScores(Array(data.categories.length).fill(0));
      })
      .catch(() => {
        setCategories(DEFAULT_CATEGORIES);
        setScores(Array(DEFAULT_CATEGORIES.length).fill(0));
      });
  }, []);

  const maxScore = categories.length * 10;
  const total = scores.reduce((a, b) => a + b, 0);
  const allScored = scores.length > 0 && scores.every((s) => s > 0);

  const setScore = useCallback((categoryIndex: number, value: number) => {
    setScores((prev) => {
      const next = [...prev];
      next[categoryIndex] = value;
      return next;
    });
  }, []);

  const handleSubmit = async () => {
    if (!allScored) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judge: judgeNum,
          contestant: parseInt(contestantNum),
          categories: scores,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setScoredList((prev) => [
        ...prev.filter((s) => s.contestant !== parseInt(contestantNum)),
        { contestant: parseInt(contestantNum), total },
      ]);
      setStep("submitted");
    } catch {
      setError("Failed to submit. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const scoreNext = () => {
    setContestantNum("");
    setScores(Array(categories.length).fill(0));
    setStep("contestant");
  };

  // Step 1: Pick judge number
  if (step === "judge") {
    return (
      <main className="min-h-dvh px-6 py-10">
        <Link href="/" className="text-pink-hot text-sm font-semibold">
          ← Back
        </Link>
        <h1 className="font-marker text-2xl text-pink-hot mt-6 mb-2">
          What&apos;s your judge number?
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Assigned by the organizer. You&apos;ll use this for all your scores.
        </p>
        <div className="grid grid-cols-5 gap-3 max-w-sm">
          {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => {
                setJudgeNum(n);
                setStep("contestant");
              }}
              className="aspect-square rounded-2xl bg-white border-2 border-pink-soft text-pink-hot font-bold text-2xl shadow-sm active:bg-pink-hot active:text-white active:scale-95 transition-all"
            >
              {n}
            </button>
          ))}
        </div>
      </main>
    );
  }

  // Step 2: Enter contestant number
  if (step === "contestant") {
    return (
      <main className="min-h-dvh px-6 py-10">
        <button
          onClick={() => setStep("judge")}
          className="text-pink-hot text-sm font-semibold"
        >
          ← Change Judge
        </button>
        <div className="mt-6 mb-2 flex items-center gap-2">
          <span className="text-xs font-bold text-white bg-purple-deep rounded-full px-3 py-1">
            Judge #{judgeNum}
          </span>
        </div>
        <h1 className="font-marker text-2xl text-pink-hot mt-4 mb-2">
          Contestant number?
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter the contestant&apos;s assigned number.
        </p>

        <div className="max-w-xs">
          <input
            type="number"
            inputMode="numeric"
            value={contestantNum}
            onChange={(e) => setContestantNum(e.target.value)}
            placeholder="e.g. 1"
            className="w-full text-center text-4xl font-bold py-4 px-6 rounded-2xl border-2 border-pink-soft focus:border-pink-hot focus:outline-none bg-white"
            autoFocus
          />
          <button
            onClick={() => {
              if (contestantNum && parseInt(contestantNum) > 0) {
                setScores(Array(categories.length).fill(0));
                setStep("scoring");
              }
            }}
            disabled={!contestantNum || parseInt(contestantNum) <= 0}
            className="w-full mt-4 py-4 rounded-2xl bg-gradient-to-r from-pink-hot to-purple-deep text-white font-bold text-lg disabled:opacity-40 active:scale-95 transition-all"
          >
            Start Scoring →
          </button>
        </div>

        {scoredList.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-sm font-bold text-purple-deep mb-2">
              Your scores so far:
            </h2>
            <div className="flex flex-wrap gap-2">
              {scoredList
                .sort((a, b) => a.contestant - b.contestant)
                .map((s) => (
                  <span
                    key={s.contestant}
                    className="text-xs bg-pink-bg text-pink-hot font-semibold px-3 py-1.5 rounded-full"
                  >
                    #{s.contestant}: {s.total}/{maxScore}
                  </span>
                ))}
            </div>
          </div>
        )}
      </main>
    );
  }

  // Step 3: Score all categories
  if (step === "scoring") {
    return (
      <main className="min-h-dvh px-4 py-8 pb-36">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setStep("contestant")}
            className="text-pink-hot text-sm font-semibold"
          >
            ← Back
          </button>
          <span className="text-xs font-bold text-white bg-purple-deep rounded-full px-3 py-1">
            Judge #{judgeNum}
          </span>
        </div>

        <div className="text-center mb-6">
          <h1 className="font-marker text-xl text-pink-hot">
            Contestant #{contestantNum}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tap a score for each category
          </p>
        </div>

        <div className="space-y-5 max-w-lg mx-auto">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-pink-soft/50"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{cat.emoji}</span>
                <h2 className="font-display text-base font-bold text-pink-hot">
                  {cat.name}
                </h2>
              </div>
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                {cat.hint}
              </p>
              <div className="flex gap-1.5 justify-between">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => setScore(idx, n)}
                    className={`flex-1 aspect-square max-w-[36px] rounded-full text-xs font-bold transition-all active:scale-90 ${
                      scores[idx] === n
                        ? "bg-pink-hot text-white shadow-md animate-pop"
                        : scores[idx] > 0 && n <= scores[idx]
                        ? "bg-pink-soft/40 text-pink-hot"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sticky submit bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-pink-soft p-4 shadow-lg">
          <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
            <div>
              <span className="text-2xl font-bold text-purple-deep">
                {total}
              </span>
              <span className="text-sm text-gray-400">/{maxScore}</span>
            </div>
            {error && (
              <p className="text-xs text-red-500 flex-1 text-center">
                {error}
              </p>
            )}
            <button
              onClick={handleSubmit}
              disabled={!allScored || submitting}
              className="py-3 px-8 rounded-2xl bg-gradient-to-r from-pink-hot to-purple-deep text-white font-bold disabled:opacity-40 active:scale-95 transition-all"
            >
              {submitting ? "Sending..." : "Submit Scores"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Step 4: Submitted!
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="text-6xl mb-4">🏳️‍🌈</div>
      <h1 className="font-marker text-2xl text-pink-hot mb-2">
        Scores Submitted!
      </h1>
      <p className="text-gray-500 mb-2">
        Contestant <strong>#{contestantNum}</strong> &mdash;{" "}
        <span className="font-bold text-purple-deep">{total}/{maxScore}</span>
      </p>
      <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-sm">
        {categories.map((cat, idx) => (
          <span
            key={cat.id}
            className="text-xs bg-pink-bg text-pink-hot px-2.5 py-1 rounded-full"
          >
            {cat.emoji} {scores[idx]}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={scoreNext}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-hot to-purple-deep text-white font-bold text-lg active:scale-95 transition-transform"
        >
          Score Next Contestant →
        </button>
        <Link
          href="/results"
          className="w-full block text-center py-3 rounded-2xl border-2 border-purple-deep text-purple-deep font-semibold active:scale-95 transition-transform"
        >
          View Leaderboard
        </Link>
      </div>
    </main>
  );
}
