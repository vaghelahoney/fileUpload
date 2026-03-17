import "dotenv/config";

import { db } from "./client";
import { user } from "./schema";
import { eq } from "drizzle-orm";
import { authClient } from "@/lib/auth-client";

async function main() {
  console.log(" Seeding Admin...");
  const ADMIN_EMAIL = "admin@gmail.com";
  const ADMIN_PASSWORD = "Admin@123";
  const NAME = "Admin";

  const existing = await db
    .select()
    .from(user)
    .where(eq(user.email, ADMIN_EMAIL));

  if (existing.length > 0) {
    console.log("Admin already exists.");
    process.exit(0);
  }

  const result = await authClient.signUp.email({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    name: NAME,
  });

  if (result.error) {
    console.error(" Sign-up failed:", result.error);
    process.exit(1);
  }

  const newUserId = result.data.user.id;

  await db
    .update(user)
    .set({ role: "admin" })
    .where(eq(user.id, newUserId));

  console.log(" Admin created successfully");
  process.exit(0);
}

main().catch((err) => {
  console.error("Script failed:", err);
  console.error(err);
  process.exit(1);
});
