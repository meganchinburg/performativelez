"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { DEFAULT_CATEGORIES, type Category, type LeaderboardEntry } from "../lib/categories";

const MEDALS = ["🥇", "🥈", "🥉"];
const PODIUM_COLORS = [
  "from-yellow-400 to-amber-500",
  "from-gray-300 to-gray-400",
  "from-amber-600 to-amber-700",
];

export default function ResultsPage() {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [totalJudges, setTotalJudges] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch categories once
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories))
      .catch(() => setCategories(DEFAULT_CATEGORIES));
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch("/api/leaderboard");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setLeaderboard(data.leaderboard);
      setTotalJudges(data.totalJudges);
      setLastUpdated(new Date());
    } catch {
      console.error("Failed to fetch leaderboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchLeaderboard]);

  const maxScore = categories.length * 10;
  const top3 = leaderboard.slice(0, 3);

  return (
    <main className="min-h-dvh px-4 py-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="text-pink-hot text-sm font-semibold">
          ← Home
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${
              autoRefresh
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {autoRefresh ? "● Live" : "○ Paused"}
          </button>
          <button
            onClick={fetchLeaderboard}
            className="text-xs bg-pink-bg text-pink-hot px-3 py-1 rounded-full font-semibold active:scale-95"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="font-marker text-2xl sm:text-3xl text-pink-hot">
          Leaderboard
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          {totalJudges} judge{totalJudges !== 1 ? "s" : ""} scoring ·{" "}
          {leaderboard.length} contestant{leaderboard.length !== 1 ? "s" : ""}
          {lastUpdated && (
            <span>
              {" "}· Updated{" "}
              {lastUpdated.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          )}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-3">🔮</div>
          <p className="text-gray-400 font-display italic">
            Consulting the Elder Council...
          </p>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-3">🏳️‍🌈</div>
          <p className="text-gray-400">No scores submitted yet.</p>
          <p className="text-xs text-gray-300 mt-1">
            Judges, get to work!
          </p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {top3.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-center items-end gap-3 mb-4">
                {[1, 0, 2].map((podiumIdx) => {
                  const entry = top3[podiumIdx];
                  if (!entry) return <div key={podiumIdx} className="flex-1" />;
                  const rank = podiumIdx;
                  const height =
                    rank === 0 ? "h-32" : rank === 1 ? "h-24" : "h-20";
                  return (
                    <div
                      key={entry.contestant}
                      className={`flex-1 max-w-[120px] text-center ${
                        rank === 0 ? "animate-glow" : ""
                      }`}
                    >
                      <div className="text-3xl mb-1">{MEDALS[rank]}</div>
                      <div
                        className={`${height} rounded-t-2xl bg-gradient-to-b ${PODIUM_COLORS[rank]} flex flex-col items-center justify-center text-white shadow-md`}
                      >
                        <span className="text-2xl font-bold">
                          #{entry.contestant}
                        </span>
                        <span className="text-xs opacity-90">
                          {entry.avgScore.toFixed(1)} avg
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full Rankings Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-pink-soft/50 overflow-hidden">
            <div className="bg-pink-bg px-4 py-3 border-b border-pink-soft/50">
              <h2 className="font-display text-sm font-bold text-purple-deep">
                Full Rankings
              </h2>
            </div>

            {leaderboard.map((entry, idx) => (
              <div key={entry.contestant}>
                <button
                  onClick={() =>
                    setExpanded(
                      expanded === entry.contestant ? null : entry.contestant
                    )
                  }
                  className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-pink-bg/50 active:bg-pink-bg transition-colors border-b border-gray-100"
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      idx < 3
                        ? "bg-pink-hot text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {idx + 1}
                  </span>

                  <span className="font-bold text-gray-800 flex-1">
                    Contestant #{entry.contestant}
                  </span>

                  <div className="text-right">
                    <div className="font-bold text-purple-deep">
                      {entry.avgScore.toFixed(1)}
                      <span className="text-xs text-gray-400 font-normal">
                        {" "}avg
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {entry.judgeCount} judge
                      {entry.judgeCount !== 1 ? "s" : ""} · {entry.totalScore}{" "}
                      total
                    </div>
                  </div>

                  <span className="text-gray-300 text-sm">
                    {expanded === entry.contestant ? "▲" : "▼"}
                  </span>
                </button>

                {expanded === entry.contestant && (
                  <div className="px-4 py-3 bg-pink-bg/30 border-b border-gray-100">
                    <p className="text-xs font-semibold text-purple-deep mb-2">
                      Category Averages (out of 10)
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 mb-3">
                      {categories.map((cat, catIdx) => {
                        const avg =
                          catIdx < entry.categoryTotals.length
                            ? entry.categoryTotals[catIdx] / entry.judgeCount
                            : 0;
                        return (
                          <div
                            key={cat.id}
                            className="flex items-center justify-between bg-white rounded-lg px-2.5 py-1.5"
                          >
                            <span className="text-xs text-gray-600 truncate mr-2">
                              {cat.emoji} {cat.name}
                            </span>
                            <span className="text-xs font-bold text-pink-hot">
                              {avg.toFixed(1)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-xs font-semibold text-purple-deep mb-2">
                      Scores by Judge
                    </p>
                    <div className="space-y-1">
                      {entry.judges
                        .sort((a, b) => a.judge - b.judge)
                        .map((j) => (
                          <div
                            key={j.judge}
                            className="flex items-center gap-2 bg-white rounded-lg px-2.5 py-1.5"
                          >
                            <span className="text-xs font-semibold text-purple-deep w-16 shrink-0">
                              Judge #{j.judge}
                            </span>
                            <div className="flex gap-1 flex-1 flex-wrap">
                              {j.categories.map((s, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-pink-bg text-pink-hot rounded px-1.5 py-0.5"
                                  title={categories[i]?.name || `Cat ${i + 1}`}
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                            <span className="text-xs font-bold text-gray-700 shrink-0">
                              {j.total}/{maxScore}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
