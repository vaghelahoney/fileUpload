import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function isLogin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { isLoggedIn: false };
  }

  return { isLoggedIn: true };
}
