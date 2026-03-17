"use server";

import { db } from "@/db/client";
import { fileStorage } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq ,desc} from "drizzle-orm"
// Class for Data Binding
class FileData {
  name: string;
  base64: string;
  userId: string;

  constructor(name: string, base64: string, userId: string) {
    this.name = name;
    this.base64 = base64;
    this.userId = userId;
  }

  async saveToDb() {
    return await db.insert(fileStorage).values({
      name: this.name,
      base64: this.base64,
      userId: this.userId,
    });
  }
}

export async function uploadFileAction(formData: FormData, userId: string) {
  try {
    const file = formData.get("file") as File;
    const displayName = formData.get("name") as string;

    console.log("Received file:", file);
    console.log("Received display name:", displayName);

    if (!file || file.size === 0) {
      return { success: false, error: "File select karein." };
    }

    // Convert to Base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64String = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Using Class to bind and save
    const fileBinding = new FileData(displayName || file.name, base64String, userId);
    await fileBinding.saveToDb();

    revalidatePath("/"); // Update UI
    return { success: true };

  } catch (error) {
    console.error("Upload Error:", error);
    return { success: false, error: "Database error: " + (error as Error).message };
  }
}

