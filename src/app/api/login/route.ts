// app/api/login/route.ts
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/db/client";


export async function POST(req: Request) {
  const { email, password } = await req.json();

  // const result = await db
  //   .select()
  //   .from(auth_users)
  //   .where(eq(auth_users.email, email))
  //   .limit(1);

  // const user = result[0];

  // if (!user) {
  //   return Response.json({ error: "Invalid credentials" }, { status: 401 });
  // }

  // const isValid = await bcrypt.compare(password, user.passwordHash);

  // if (!isValid) {
  //   return Response.json({ error: "Invalid credentials" }, { status: 401 });
  // }

  return Response.json({ success: true });
}
