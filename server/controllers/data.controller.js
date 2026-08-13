import { pool } from "../server/db.js";
import { assembleData } from "../db/mappers.js";

export async function getData(req, res) {
  res.json(await assembleData(pool));
}
