import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../server/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  await pool.query(sql);
  console.log("Schema migrated.");
  await pool.end();
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
