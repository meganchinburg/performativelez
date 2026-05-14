import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const MAX_ATTEMPTS = 10;
const WINDOW_SECONDS = 15 * 60; // 15 minutes

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const key = `auth:attempts:${ip}`;

  const attempts = (await kv.incr(key)) as number;
  if (attempts === 1) {
    await kv.expire(key, WINDOW_SECONDS);
  }

  if (attempts > MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "Too many attempts — try again in 15 minutes" },
      { status: 429 }
    );
  }

  const { password } = await request.json();

  if (password !== process.env.CONFIG_PASSWORD) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  // Clear the counter on success
  await kv.del(key);

  const response = NextResponse.json({ ok: true });
  response.cookies.set("site-auth", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // No maxAge = session cookie (expires when browser closes)
  });
  return response;
}
