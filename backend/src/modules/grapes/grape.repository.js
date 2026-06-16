import { db } from "../../database/connection.js";

export async function findAll() {
  const [rows] = await db.query(`
    SELECT id, name, slug, description, active, created_at, updated_at
    FROM grapes
    WHERE deleted_at IS NULL
    ORDER BY name ASC
  `);

  return rows;
}

export async function findById(id) {
  const [rows] = await db.query(
    `
    SELECT id, name, slug, description, active, created_at, updated_at
    FROM grapes
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
    FROM grapes
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
    INSERT INTO grapes (name, slug, description)
    VALUES (?, ?, ?)
    `,
    [data.name, data.slug, data.description || null],
  );

  return findById(result.insertId);
}

export async function update(id, data) {
  await db.query(
    `
    UPDATE grapes
    SET name = ?, slug = ?, description = ?
    WHERE id = ? AND deleted_at IS NULL
    `,
    [data.name, data.slug, data.description || null, id],
  );

  return findById(id);
}

export async function activate(id) {
  await db.query(
    `
    UPDATE grapes
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
    UPDATE grapes
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
    UPDATE grapes
    SET active = false, deleted_at = CURRENT_TIMESTAMP
    WHERE id = ? AND deleted_at IS NULL
    `,
    [id],
  );

  return true;
}
