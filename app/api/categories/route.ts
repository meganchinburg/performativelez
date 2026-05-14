import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_CATEGORIES, type Category } from "@/app/lib/categories";

const KV_KEY = "contest:categories";

export async function GET() {
  try {
    const stored = await kv.get<Category[]>(KV_KEY);
    return NextResponse.json({
      categories: stored || DEFAULT_CATEGORIES,
      isCustom: !!stored,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ categories: DEFAULT_CATEGORIES, isCustom: false });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { categories } = body;

    if (!Array.isArray(categories) || categories.length < 1 || categories.length > 10) {
      return NextResponse.json(
        { error: "Must have 1-10 categories" },
        { status: 400 }
      );
    }

    // Validate shape
    for (const cat of categories) {
      if (!cat.id || !cat.name || !cat.emoji || !cat.hint) {
        return NextResponse.json(
          { error: "Each category needs id, name, emoji, and hint" },
          { status: 400 }
        );
      }
    }

    await kv.set(KV_KEY, categories);
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Error saving categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Reset to defaults
export async function DELETE() {
  try {
    await kv.del(KV_KEY);
    return NextResponse.json({ success: true, categories: DEFAULT_CATEGORIES });
  } catch (error) {
    console.error("Error resetting categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
