"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DEFAULT_CATEGORIES, type Category } from "../lib/categories";

export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories))
      .catch(() => setCategories(DEFAULT_CATEGORIES))
      .finally(() => setLoading(false));
  }, []);

  const flash = (type: "ok" | "err", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const updateCat = (idx: number, field: keyof Category, value: string) => {
    setCategories((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const addCategory = () => {
    if (categories.length >= 10) return;
    setCategories((prev) => [
      ...prev,
      {
        id: `custom_${Date.now()}`,
        name: "New Category",
        emoji: "⭐",
        hint: "Describe what judges should look for here.",
      },
    ]);
  };

  const removeCategory = (idx: number) => {
    if (categories.length <= 1) return;
    setCategories((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveCategory = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= categories.length) return;
    setCategories((prev) => {
      const next = [...prev];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    });
  };

  const saveCategories = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories }),
      });
      if (!res.ok) throw new Error();
      flash("ok", "Categories saved! Judges will see the new ones.");
    } catch {
      flash("err", "Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = async () => {
    if (!confirm("Reset categories to the original defaults?")) return;
    try {
      const res = await fetch("/api/categories", { method: "DELETE" });
      if (!res.ok) throw new Error();
      setCategories(DEFAULT_CATEGORIES);
      flash("ok", "Reset to defaults.");
    } catch {
      flash("err", "Failed to reset.");
    }
  };

  const resetScores = async () => {
    if (!confirm("⚠️ Delete ALL submitted scores? This can't be undone.")) return;
    if (!confirm("Are you really sure? Every judge's scores will be gone.")) return;
    try {
      const res = await fetch("/api/scores", { method: "DELETE" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      flash("ok", `Deleted ${data.deleted} scores.`);
    } catch {
      flash("err", "Failed to delete scores.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-dvh flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </main>
    );
  }

  const maxScore = categories.length * 10;

  return (
    <main className="min-h-dvh px-4 py-8 max-w-2xl mx-auto pb-32">
      <Link href="/" className="text-pink-hot text-sm font-semibold">
        ← Home
      </Link>

      <h1 className="font-marker text-2xl text-pink-hot mt-6 mb-1">
        Contest Setup
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Customize your judging categories. Each is scored 1–10, max {maxScore} per judge.
      </p>

      {message && (
        <div
          className={`mb-4 px-4 py-2 rounded-xl text-sm font-semibold ${
            message.type === "ok"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-pink-soft/50 shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-purple-deep/50 uppercase">
                Category {idx + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveCategory(idx, -1)}
                  disabled={idx === 0}
                  className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 text-xs disabled:opacity-30 active:scale-90"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveCategory(idx, 1)}
                  disabled={idx === categories.length - 1}
                  className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 text-xs disabled:opacity-30 active:scale-90"
                >
                  ▼
                </button>
                <button
                  onClick={() => removeCategory(idx)}
                  disabled={categories.length <= 1}
                  className="w-7 h-7 rounded-lg bg-red-50 text-red-400 text-xs disabled:opacity-30 active:scale-90 ml-1"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="grid grid-cols-[60px_1fr] gap-2 mb-2">
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-semibold">
                  Emoji
                </label>
                <input
                  type="text"
                  value={cat.emoji}
                  onChange={(e) => updateCat(idx, "emoji", e.target.value)}
                  maxLength={4}
                  className="w-full text-center text-2xl py-1 px-1 rounded-lg border border-gray-200 focus:border-pink-hot focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-semibold">
                  Category Name
                </label>
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) => updateCat(idx, "name", e.target.value)}
                  placeholder="e.g. The Fit"
                  className="w-full py-1.5 px-3 rounded-lg border border-gray-200 focus:border-pink-hot focus:outline-none font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 uppercase font-semibold">
                Hint / Examples for Judges
              </label>
              <textarea
                value={cat.hint}
                onChange={(e) => updateCat(idx, "hint", e.target.value)}
                placeholder="Describe what judges should look for, with specific examples..."
                rows={2}
                className="w-full py-1.5 px-3 rounded-lg border border-gray-200 focus:border-pink-hot focus:outline-none text-sm resize-none"
              />
            </div>
          </div>
        ))}
      </div>

      {categories.length < 10 && (
        <button
          onClick={addCategory}
          className="w-full mt-4 py-3 rounded-2xl border-2 border-dashed border-pink-soft text-pink-hot font-semibold active:scale-95 transition-transform"
        >
          + Add Category
        </button>
      )}

      {/* Sticky save bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-pink-soft p-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={saveCategories}
            disabled={saving}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-hot to-purple-deep text-white font-bold active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : `Save Categories (${categories.length})`}
          </button>
          <button
            onClick={resetToDefaults}
            className="py-3 px-4 rounded-2xl bg-gray-100 text-gray-500 text-sm font-semibold active:scale-95"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="mt-10 p-4 rounded-2xl border-2 border-red-200 bg-red-50/50">
        <h2 className="font-display text-sm font-bold text-red-500 mb-2">
          Danger Zone
        </h2>
        <p className="text-xs text-red-400 mb-3">
          Clear all submitted scores. Use this to reset between rounds or after
          testing. This cannot be undone.
        </p>
        <button
          onClick={resetScores}
          className="py-2 px-5 rounded-xl bg-red-500 text-white text-sm font-bold active:scale-95 transition-transform"
        >
          Delete All Scores
        </button>
      </div>
    </main>
  );
}
