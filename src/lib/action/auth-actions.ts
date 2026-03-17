import { authClient } from "@/lib/auth-client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type SocialSignInOptions = {
  provider: "google" | "github";
  callbackURL?: string;
};

interface EmailSignInParams {
  email: string;
  password: string;
  callbackURL?: string;
  name?: string; // Optional for sign-up
}

type SignOutOptions = {
  router: AppRouterInstance;
  callbackURL: string;
};

export async function signInWithEmail({
  email,
  password,
  callbackURL,
}: EmailSignInParams) {
 
  const result = await authClient.signIn.email({
    email,
    password,
    callbackURL,
  });
  console.log("signInWithEmail result:", result); 

  return result;
}

export async function signUpWithEmail({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) {
  const result = await authClient.signUp.email({
    email,
    password,
    name,
  });

  return result;
}

export async function signOut({ router, callbackURL }: SignOutOptions) {
  return authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        router.push(callbackURL);
      },
    },
  });
}

export async function signInWithSocial({provider,callbackURL = "/dashboard",}: SocialSignInOptions) {
  return authClient.signIn.social({
    provider,
    callbackURL,
  });
}
