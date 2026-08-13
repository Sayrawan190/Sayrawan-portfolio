import { pool } from "../server/db.js";
import { assembleData, LIST_CONFIG, makeId } from "../db/mappers.js";

export function validateListKey(req, res, next, listKey) {
  const config = LIST_CONFIG[listKey];
  if (!config) return res.status(404).json({ error: "unknown_list" });
  req.listConfig = config;
  next();
}

export async function addItem(req, res) {
  const { table, idPrefix, toRow } = req.listConfig;
  const id = makeId(idPrefix);
  const row = toRow(req.body ?? {});
  const columns = Object.keys(row);
  const { rows: posRows } = await pool.query(
    `SELECT COALESCE(MAX(position), -1) + 1 AS next_position FROM ${table}`
  );
  const position = posRows[0].next_position;

  const allColumns = ["id", "position", ...columns];
  const values = [id, position, ...columns.map((c) => row[c])];
  const placeholders = allColumns.map((_, i) => `$${i + 1}`).join(",");
  await pool.query(
    `INSERT INTO ${table} (${allColumns.join(",")}) VALUES (${placeholders})`,
    values
  );

  res.json({ data: await assembleData(pool), insertedId: id });
}

export async function updateItem(req, res) {
  const { table, toRow } = req.listConfig;
  const row = toRow(req.body ?? {});
  const columns = Object.keys(row);
  if (columns.length > 0) {
    const setClause = columns.map((c, i) => `${c} = $${i + 1}`).join(", ");
    await pool.query(
      `UPDATE ${table} SET ${setClause} WHERE id = $${columns.length + 1}`,
      [...columns.map((c) => row[c]), req.params.id]
    );
  }
  res.json(await assembleData(pool));
}

export async function deleteItem(req, res) {
  const { table } = req.listConfig;
  await pool.query(`DELETE FROM ${table} WHERE id = $1`, [req.params.id]);
  res.json(await assembleData(pool));
}

export async function reorderItems(req, res) {
  const { table } = req.listConfig;
  const order = Array.isArray(req.body?.order) ? req.body.order : [];
  for (let i = 0; i < order.length; i++) {
    await pool.query(`UPDATE ${table} SET position = $1 WHERE id = $2`, [i, order[i]]);
  }
  res.json(await assembleData(pool));
}
