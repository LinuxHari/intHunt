import { defineConfig } from "drizzle-kit";
import env from "./env";

export default defineConfig({
  schema: "./lib/schema.ts",
  out: "./supabase/migrations",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: env.POSTGRESQL_URL!,
  },
});
