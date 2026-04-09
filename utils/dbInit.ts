import "server-only";
import { syncDB } from "@/utils/db";

let dbInitPromise: Promise<void> | null = null;

export async function ensureDbInitialized(): Promise<void> {
  if (!dbInitPromise) {
    dbInitPromise = syncDB()
      .then(() => {
        console.log("[Startup] Database sync completed.");
      })
      .catch((error) => {
        dbInitPromise = null;
        console.error("[Startup] Database sync failed:", error);
        throw error;
      });
  }

  await dbInitPromise;
}
