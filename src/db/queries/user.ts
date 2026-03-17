import { db } from "@/db/client";
import { user } from "@/db/schema";
import { eq, isNull } from "drizzle-orm";

export async function updateNullUserId(
  email: string,
  authUserId: string
) {
  return db
    .update(user)
    .set({
      userId: authUserId,
      updatedAt: new Date(),
    })
    .where(eq(user.email, email));
}
