import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: [
    './src/db/schema.ts',      // Your auth/original schema
    './src/db/schema/crs.ts'   // Your new CRS schema
  ],
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NETLIFY_DATABASE_URL!,
    // url: "postgresql://neondb_owner:npg_2ZWnR8ktmIOs@ep-raspy-hill-aeeqz9go-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require",
  },
});

