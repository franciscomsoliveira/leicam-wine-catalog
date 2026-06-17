import { db } from "../../database/connection.js";

export async function findAllByWineId(wineId) {
  const [rows] = await db.query(
    `
    SELECT
      wg.id,
      wg.wine_id,
      wg.grape_id,
      wg.percentage,
      g.name AS grape_name,
      g.slug AS grape_slug
    FROM wine_grapes wg
    INNER JOIN grapes g
      ON g.id = wg.grape_id
    WHERE wg.wine_id = ?
    ORDER BY g.name ASC
    `,
    [wineId],
  );

  return rows;
}

export async function findById(id) {
  const [rows] = await db.query(
    `
    SELECT *
    FROM wine_grapes
    WHERE id = ?
    LIMIT 1
    `,
    [id],
  );

  return rows[0];
}

export async function wineExists(wineId) {
  const [rows] = await db.query(
    `
    SELECT id
    FROM wines
    WHERE id = ?
      AND active = true
      AND deleted_at IS NULL
    LIMIT 1
    `,
    [wineId],
  );

  return !!rows[0];
}

export async function grapeExists(grapeId) {
  const [rows] = await db.query(
    `
    SELECT id
    FROM grapes
    WHERE id = ?
      AND active = true
      AND deleted_at IS NULL
    LIMIT 1
    `,
    [grapeId],
  );

  return !!rows[0];
}

export async function findDuplicate(wineId, grapeId) {
  const [rows] = await db.query(
    `
    SELECT id
    FROM wine_grapes
    WHERE wine_id = ?
      AND grape_id = ?
    LIMIT 1
    `,
    [wineId, grapeId],
  );

  return rows[0];
}

export async function create(data) {
  const [result] = await db.query(
    `
    INSERT INTO wine_grapes (
      wine_id,
      grape_id,
      percentage
    )
    VALUES (?, ?, ?)
    `,
    [data.wine_id, data.grape_id, data.percentage || null],
  );

  return findById(result.insertId);
}

export async function remove(id) {
  await db.query(
    `
    DELETE FROM wine_grapes
    WHERE id = ?
    `,
    [id],
  );

  return true;
}
