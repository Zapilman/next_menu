import fs from "node:fs";
import path from "node:path";
import { createClient, type Client } from "@libsql/client";

const dbPath = path.join(process.cwd(), "data", "menu.db");
const dbUrl = `file:${dbPath.replaceAll("\\", "/")}`;

const globalForDb = globalThis as typeof globalThis & {
  sqlite?: Client;
};

export const getDb = (): Client => {
  if (globalForDb.sqlite) {
    return globalForDb.sqlite;
  }

  if (!fs.existsSync(dbPath)) {
    throw new Error("Нет data/menu.db. Запусти `pnpm seed`.");
  }

  globalForDb.sqlite = createClient({ url: dbUrl });
  return globalForDb.sqlite;
};
