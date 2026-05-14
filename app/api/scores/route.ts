import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { judge, contestant, categories } = body;

    if (
      !judge ||
      !contestant ||
      !Array.isArray(categories) ||
      categories.length < 1 ||
      categories.length > 10
    ) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Validate all scores are 1-10
    if (categories.some((s: number) => s < 1 || s > 10 || !Number.isInteger(s))) {
      return NextResponse.json(
        { error: "Scores must be integers 1-10" },
        { status: 400 }
      );
    }

    const total = categories.reduce((a: number, b: number) => a + b, 0);
    const key = `score:${judge}:${contestant}`;

    await kv.set(key, {
      judge,
      contestant,
      categories,
      total,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, total });
  } catch (error) {
    console.error("Error saving score:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const judge = req.nextUrl.searchParams.get("judge");
    const pattern = judge ? `score:${judge}:*` : "score:*";

    const keys = await kv.keys(pattern);
    if (keys.length === 0) {
      return NextResponse.json({ scores: [] });
    }

    const values = await kv.mget(...keys);
    const scores = values.filter(Boolean);

    return NextResponse.json({ scores });
  } catch (error) {
    console.error("Error fetching scores:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE all scores (admin reset)
export async function DELETE() {
  try {
    const keys = await kv.keys("score:*");
    if (keys.length > 0) {
      await Promise.all(keys.map((key) => kv.del(key)));
    }
    return NextResponse.json({ success: true, deleted: keys.length });
  } catch (error) {
    console.error("Error deleting scores:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
