import { db } from "../../database/connection.js";

export async function findAll({ page, limit, search, city }) {
  const offset = (page - 1) * limit;

  const conditions = ["deleted_at IS NULL"];
  const params = [];

  if (search) {
    conditions.push("(name LIKE ? OR city LIKE ? OR address LIKE ?)");
    const searchValue = `%${search}%`;
    params.push(searchValue, searchValue, searchValue);
  }

  if (city) {
    conditions.push("city LIKE ?");
    params.push(`%${city}%`);
  }

  const where = conditions.join(" AND ");

  const [rows] = await db.query(
    `
    SELECT
      id,
      name,
      slug,
      logo_url,
      cover_url,
      city,
      address,
      phone,
      active,
      created_at,
      updated_at
    FROM restaurants
    WHERE ${where}
    ORDER BY name ASC
    LIMIT ? OFFSET ?
    `,
    [...params, limit, offset],
  );

  const [countRows] = await db.query(
    `
    SELECT COUNT(*) AS total
    FROM restaurants
    WHERE ${where}
    `,
    params,
  );

  return {
    items: rows,
    page,
    limit,
    total: countRows[0].total,
  };
}

export async function findById(id) {
  const [rows] = await db.query(
    `
    SELECT
      id,
      name,
      slug,
      logo_url,
      cover_url,
      city,
      address,
      phone,
      active,
      created_at,
      updated_at
    FROM restaurants
    WHERE id = ? AND deleted_at IS NULL
    LIMIT 1
    `,
    [id],
  );

  return rows[0];
}

export async function findBySlug(slug) {
  const [rows] = await db.query(
    `
    SELECT id, name, slug
    FROM restaurants
    WHERE slug = ? AND deleted_at IS NULL
    LIMIT 1
    `,
    [slug],
  );

  return rows[0];
}

export async function create(data) {
  const [result] = await db.query(
    `
    INSERT INTO restaurants (
      name,
      slug,
      logo_url,
      cover_url,
      city,
      address,
      phone
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.name,
      data.slug,
      data.logo_url || null,
      data.cover_url || null,
      data.city || null,
      data.address || null,
      data.phone || null,
    ],
  );

  return findById(result.insertId);
}

export async function update(id, data) {
  await db.query(
    `
    UPDATE restaurants
    SET
      name = ?,
      slug = ?,
      logo_url = ?,
      cover_url = ?,
      city = ?,
      address = ?,
      phone = ?
    WHERE id = ? AND deleted_at IS NULL
    `,
    [
      data.name,
      data.slug,
      data.logo_url || null,
      data.cover_url || null,
      data.city || null,
      data.address || null,
      data.phone || null,
      id,
    ],
  );

  return findById(id);
}

export async function activate(id) {
  await db.query(
    `
    UPDATE restaurants
    SET active = true
    WHERE id = ? AND deleted_at IS NULL
    `,
    [id],
  );

  return findById(id);
}

export async function deactivate(id) {
  await db.query(
    `
    UPDATE restaurants
    SET active = false
    WHERE id = ? AND deleted_at IS NULL
    `,
    [id],
  );

  return findById(id);
}

export async function softDelete(id) {
  await db.query(
    `
    UPDATE restaurants
    SET active = false, deleted_at = CURRENT_TIMESTAMP
    WHERE id = ? AND deleted_at IS NULL
    `,
    [id],
  );

  return true;
}
