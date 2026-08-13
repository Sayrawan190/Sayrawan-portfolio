import { pool } from "../server/db.js";
import { assembleData, SKILL_MAPPER, makeId } from "../db/mappers.js";

export async function addSkill(req, res) {
  const row = SKILL_MAPPER.toRow(req.body ?? {});
  const id = makeId("skill");
  const { rows: posRows } = await pool.query(
    "SELECT COALESCE(MAX(position), -1) + 1 AS next_position FROM skills WHERE category_id = $1",
    [req.params.categoryId]
  );
  const position = posRows[0].next_position;

  await pool.query(
    "INSERT INTO skills (id, category_id, position, name_en, name_ar, level) VALUES ($1,$2,$3,$4,$5,$6)",
    [id, req.params.categoryId, position, row.name_en, row.name_ar, row.level]
  );

  res.json({ data: await assembleData(pool), insertedId: id });
}

export async function updateSkill(req, res) {
  const row = SKILL_MAPPER.toRow(req.body ?? {});
  await pool.query(
    "UPDATE skills SET name_en=$1, name_ar=$2, level=$3 WHERE id = $4 AND category_id = $5",
    [row.name_en, row.name_ar, row.level, req.params.skillId, req.params.categoryId]
  );
  res.json(await assembleData(pool));
}

export async function deleteSkill(req, res) {
  await pool.query("DELETE FROM skills WHERE id = $1 AND category_id = $2", [
    req.params.skillId,
    req.params.categoryId,
  ]);
  res.json(await assembleData(pool));
}
