import { db } from "../../database/connection.js";

export async function findAll({ wine_list_id }) {
  const params = [];
  const conditions = ["1 = 1"];

  if (wine_list_id) {
    conditions.push("wli.wine_list_id = ?");
    params.push(wine_list_id);
  }

  const [rows] = await db.query(
    `
    SELECT
      wli.*,
      w.name AS wine_name,
      w.producer,
      w.country_code,
      ws.name AS style_name,
      wl.name AS wine_list_name
    FROM wine_list_items wli
    INNER JOIN wines w ON w.id = wli.wine_id
    INNER JOIN wine_styles ws ON ws.id = w.style_id
    INNER JOIN wine_lists wl ON wl.id = wli.wine_list_id
    WHERE ${conditions.join(" AND ")}
    ORDER BY wli.display_order ASC, w.name ASC
    `,
    params,
  );

  return rows;
}

export async function findById(id) {
  const [rows] = await db.query(
    `
    SELECT
      wli.*,
      w.name AS wine_name,
      wl.name AS wine_list_name
    FROM wine_list_items wli
    INNER JOIN wines w ON w.id = wli.wine_id
    INNER JOIN wine_lists wl ON wl.id = wli.wine_list_id
    WHERE wli.id = ?
    LIMIT 1
    `,
    [id],
  );

  return rows[0];
}

export async function wineListExists(wineListId) {
  const [rows] = await db.query(
    `
    SELECT id
    FROM wine_lists
    WHERE id = ?
      AND active = true
      AND deleted_at IS NULL
    LIMIT 1
    `,
    [wineListId],
  );

  return !!rows[0];
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

export async function findDuplicate(wineListId, wineId) {
  const [rows] = await db.query(
    `
    SELECT id
    FROM wine_list_items
    WHERE wine_list_id = ?
      AND wine_id = ?
    LIMIT 1
    `,
    [wineListId, wineId],
  );

  return rows[0];
}

export async function getNextDisplayOrder(wineListId) {
  const [rows] = await db.query(
    `
    SELECT COALESCE(MAX(display_order), 0) + 1 AS next_order
    FROM wine_list_items
    WHERE wine_list_id = ?
    `,
    [wineListId],
  );

  return rows[0]?.next_order || 1;
}

export async function create(data) {
  const [result] = await db.query(
    `
    INSERT INTO wine_list_items (
      wine_list_id,
      wine_id,
      bottle_price,
      glass_price,
      currency,
      available,
      featured,
      display_order
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.wine_list_id,
      data.wine_id,
      data.bottle_price || null,
      data.glass_price || null,
      data.currency || "BRL",
      data.available,
      data.featured,
      data.display_order || 0,
    ],
  );

  return findById(result.insertId);
}

export async function update(id, data) {
  await db.query(
    `
    UPDATE wine_list_items
    SET
      bottle_price = ?,
      glass_price = ?,
      currency = ?,
      available = ?,
      featured = ?,
      display_order = ?
    WHERE id = ?
    `,
    [
      data.bottle_price || null,
      data.glass_price || null,
      data.currency || "BRL",
      data.available,
      data.featured,
      data.display_order || 0,
      id,
    ],
  );

  return findById(id);
}

export async function setAvailable(id, available) {
  await db.query(
    `
    UPDATE wine_list_items
    SET available = ?
    WHERE id = ?
    `,
    [available, id],
  );

  return findById(id);
}

export async function setFeatured(id, featured) {
  await db.query(
    `
    UPDATE wine_list_items
    SET featured = ?
    WHERE id = ?
    `,
    [featured, id],
  );

  return findById(id);
}

export async function remove(id) {
  await db.query(
    `
    DELETE FROM wine_list_items
    WHERE id = ?
    `,
    [id],
  );

  return true;
}
