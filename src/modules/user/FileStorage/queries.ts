"use server"
import { db } from "@/db/client";
import { fileStorage } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getFiles(userId: string) {
  try {
    const files = await db
      .select()
      .from(fileStorage)
      .where(eq(fileStorage.userId, userId))
      .orderBy(desc(fileStorage.createdAt));

    return { success: true, data: files };
  } catch (error) {
    return { success: false, error: "Data fetch nahi ho paya" };
  }
}
