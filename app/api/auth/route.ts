import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password !== process.env.SITE_PASSWORD) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("site-auth", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // No maxAge = session cookie (expires when browser closes)
  });
  return response;
}
