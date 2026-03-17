import { NextResponse } from "next/server";
import { updateNullUserId } from "@/db/queries/user";

export async function POST(req: Request) {
  const { email, userId } = await req.json();

  if (!email || !userId) {
    return NextResponse.json(
      { error: "Missing email or userId" },
      { status: 400 }
    );
  }

  await updateNullUserId(email, userId);

  return NextResponse.json({ success: true });
}
