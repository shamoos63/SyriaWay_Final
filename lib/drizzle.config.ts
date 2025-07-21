import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./drizzle/schema.ts", // Path to your schema (you'll create this)
  out: "./drizzle/migrations",   // Where to put migrations
  driver: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN, // if needed
  },
});