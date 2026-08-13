import { pool } from "../server/db.js";
import { assembleData } from "../db/mappers.js";
import { seedDatabase } from "../db/seed.js";

// Reseeds content tables only — the admin password lives in admin_auth,
// which seedDatabase never touches, so resetting content never affects login.
export async function reset(req, res) {
  await seedDatabase(pool);
  res.json(await assembleData(pool));
}
