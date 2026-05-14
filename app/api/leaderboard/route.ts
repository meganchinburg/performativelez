import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

interface StoredScore {
  judge: number;
  contestant: number;
  categories: number[];
  total: number;
  timestamp: string;
}

export async function GET() {
  try {
    const keys = await kv.keys("score:*");

    if (keys.length === 0) {
      return NextResponse.json({ leaderboard: [], totalJudges: 0 });
    }

    const values = (await kv.mget(...keys)) as (StoredScore | null)[];

    // Group by contestant
    const byContestant: Record<
      number,
      {
        contestant: number;
        judges: { judge: number; categories: number[]; total: number }[];
        totalScore: number;
        categoryTotals: number[];
      }
    > = {};

    const allJudges = new Set<number>();

    values.forEach((score) => {
      if (!score) return;
      const { contestant, judge, categories, total } = score;
      allJudges.add(judge);

      if (!byContestant[contestant]) {
        byContestant[contestant] = {
          contestant,
          judges: [],
          totalScore: 0,
          categoryTotals: new Array(categories.length).fill(0),
        };
      }

      byContestant[contestant].judges.push({ judge, categories, total });
      byContestant[contestant].totalScore += total;
      categories.forEach((s, i) => {
        byContestant[contestant].categoryTotals[i] += s;
      });
    });

    const leaderboard = Object.values(byContestant)
      .map((entry) => ({
        ...entry,
        judgeCount: entry.judges.length,
        avgScore: entry.totalScore / entry.judges.length,
      }))
      .sort((a, b) => {
        // Sort by avg score desc, then by total score desc for tiebreaker
        if (Math.abs(b.avgScore - a.avgScore) > 0.001) {
          return b.avgScore - a.avgScore;
        }
        return b.totalScore - a.totalScore;
      });

    return NextResponse.json({
      leaderboard,
      totalJudges: allJudges.size,
    });
  } catch (error) {
    console.error("Error building leaderboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
