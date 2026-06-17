import { db } from "../../database/connection.js";

export async function restaurantExists(restaurantId) {
  const [rows] = await db.query(
    `
    SELECT id
    FROM restaurants
    WHERE id = ?
      AND active = true
      AND deleted_at IS NULL
    LIMIT 1
    `,
    [restaurantId],
  );

  return !!rows[0];
}

export async function findAll({ restaurant_id, published }) {
  const conditions = ["wl.deleted_at IS NULL"];
  const params = [];

  if (restaurant_id) {
    conditions.push("wl.restaurant_id = ?");
    params.push(restaurant_id);
  }

  if (published !== undefined) {
    conditions.push("wl.published = ?");
    params.push(published === "true");
  }

  const where = conditions.join(" AND ");

  const [rows] = await db.query(
    `
    SELECT
      wl.*,
      r.name AS restaurant_name
    FROM wine_lists wl
    INNER JOIN restaurants r
      ON r.id = wl.restaurant_id
    WHERE ${where}
    ORDER BY wl.name ASC
    `,
    params,
  );

  return rows;
}

export async function findById(id) {
  const [rows] = await db.query(
    `
    SELECT *
    FROM wine_lists
    WHERE id = ?
      AND deleted_at IS NULL
    LIMIT 1
    `,
    [id],
  );

  return rows[0];
}

export async function findBySlug(restaurantId, slug) {
  const [rows] = await db.query(
    `
    SELECT id
    FROM wine_lists
    WHERE restaurant_id = ?
      AND slug = ?
      AND deleted_at IS NULL
    LIMIT 1
    `,
    [restaurantId, slug],
  );

  return rows[0];
}

export async function clearDefaultRestaurantLists(restaurantId) {
  await db.query(
    `
    UPDATE wine_lists
    SET is_default = false
    WHERE restaurant_id = ?
    `,
    [restaurantId],
  );
}

export async function create(data) {
  const [result] = await db.query(
    `
    INSERT INTO wine_lists (
      restaurant_id,
      name,
      slug,
      description,
      is_default,
      published
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      data.restaurant_id,
      data.name,
      data.slug,
      data.description || null,
      data.is_default,
      data.published,
    ],
  );

  return findById(result.insertId);
}

export async function update(id, data) {
  await db.query(
    `
    UPDATE wine_lists
    SET
      name = ?,
      slug = ?,
      description = ?,
      is_default = ?,
      published = ?
    WHERE id = ?
    `,
    [
      data.name,
      data.slug,
      data.description || null,
      data.is_default,
      data.published,
      id,
    ],
  );

  return findById(id);
}

export async function activate(id) {
  await db.query(
    `
    UPDATE wine_lists
    SET active = true
    WHERE id = ?
    `,
    [id],
  );

  return findById(id);
}

export async function deactivate(id) {
  await db.query(
    `
    UPDATE wine_lists
    SET active = false
    WHERE id = ?
    `,
    [id],
  );

  return findById(id);
}

export async function publish(id) {
  await db.query(
    `
    UPDATE wine_lists
    SET published = true
    WHERE id = ?
    `,
    [id],
  );

  return findById(id);
}

export async function unpublish(id) {
  await db.query(
    `
    UPDATE wine_lists
    SET published = false
    WHERE id = ?
    `,
    [id],
  );

  return findById(id);
}

export async function softDelete(id) {
  await db.query(
    `
    UPDATE wine_lists
    SET
      active = false,
      deleted_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
    [id],
  );

  return true;
}
