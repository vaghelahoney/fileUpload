import { betterAuth, APIError } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/client";
import { multiSession } from "better-auth/plugins/multi-session";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!, // ✅ Correct key name

  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  emailAndPassword: {
    enabled: true,
  },
  plugins: [multiSession()],

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes (in seconds)
    },
  },

  refreshToken: {
    enabled: true,
    rotation: "security", // Rotate tokens for security
    maxAge: 60 * 60 * 24 * 2, // 2 days refresh session
  },

  expiration: {
    maxAge: 60 * 60 * 24 * 7, // 7 days active session
    autoRenew: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID! as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET! as string,
    },
  },


});
