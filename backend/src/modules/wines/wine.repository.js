import { db } from "../../database/connection.js";

export async function findAll({ page, limit, search, style_id, country_code }) {
  const offset = (page - 1) * limit;

  const conditions = ["w.deleted_at IS NULL"];
  const params = [];

  if (search) {
    conditions.push(`
      (
        w.name LIKE ?
        OR w.producer LIKE ?
        OR w.region LIKE ?
        OR w.search_keywords LIKE ?
      )
    `);

    const searchValue = `%${search}%`;
    params.push(searchValue, searchValue, searchValue, searchValue);
  }

  if (style_id) {
    conditions.push("w.style_id = ?");
    params.push(style_id);
  }

  if (country_code) {
    conditions.push("w.country_code = ?");
    params.push(country_code.toUpperCase());
  }

  const where = conditions.join(" AND ");

  const [rows] = await db.query(
    `
    SELECT 
      w.id,
      w.name,
      w.slug,
      w.producer,
      w.style_id,
      ws.name AS style_name,
      w.country_code,
      w.region,
      w.vintage,
      w.alcohol_content,
      w.serving_temperature,
      w.image_url,
      w.thumbnail_url,
      w.short_description,
      w.active,
      w.created_at,
      w.updated_at
    FROM wines w
    INNER JOIN wine_styles ws ON ws.id = w.style_id
    WHERE ${where}
    ORDER BY w.name ASC
    LIMIT ? OFFSET ?
    `,
    [...params, limit, offset],
  );

  const [countRows] = await db.query(
    `
    SELECT COUNT(*) AS total
    FROM wines w
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
      w.*,
      ws.name AS style_name,
      ws.slug AS style_slug
    FROM wines w
    INNER JOIN wine_styles ws ON ws.id = w.style_id
    WHERE w.id = ? AND w.deleted_at IS NULL
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
    FROM wines
    WHERE slug = ? AND deleted_at IS NULL
    LIMIT 1
    `,
    [slug],
  );

  return rows[0];
}

export async function findByNameAndProducer(name, producer) {
  const [rows] = await db.query(
    `
    SELECT id, name, producer
    FROM wines
    WHERE name = ? 
      AND producer = ?
      AND deleted_at IS NULL
    LIMIT 1
    `,
    [name, producer],
  );

  return rows[0];
}

export async function styleExists(styleId) {
  const [rows] = await db.query(
    `
    SELECT id
    FROM wine_styles
    WHERE id = ? 
      AND active = true
      AND deleted_at IS NULL
    LIMIT 1
    `,
    [styleId],
  );

  return !!rows[0];
}

export async function create(data) {
  const [result] = await db.query(
    `
    INSERT INTO wines (
      name,
      slug,
      producer,
      style_id,
      country_code,
      region,
      vintage,
      alcohol_content,
      serving_temperature,
      image_url,
      thumbnail_url,
      short_description,
      description,
      tasting_notes,
      pairing,
      search_keywords
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.name,
      data.slug,
      data.producer,
      data.style_id,
      data.country_code,
      data.region || null,
      data.vintage || null,
      data.alcohol_content || null,
      data.serving_temperature || null,
      data.image_url || null,
      data.thumbnail_url || null,
      data.short_description || null,
      data.description || null,
      data.tasting_notes || null,
      data.pairing || null,
      data.search_keywords || null,
    ],
  );

  return findById(result.insertId);
}

export async function update(id, data) {
  await db.query(
    `
    UPDATE wines
    SET
      name = ?,
      slug = ?,
      producer = ?,
      style_id = ?,
      country_code = ?,
      region = ?,
      vintage = ?,
      alcohol_content = ?,
      serving_temperature = ?,
      image_url = ?,
      thumbnail_url = ?,
      short_description = ?,
      description = ?,
      tasting_notes = ?,
      pairing = ?,
      search_keywords = ?
    WHERE id = ? AND deleted_at IS NULL
    `,
    [
      data.name,
      data.slug,
      data.producer,
      data.style_id,
      data.country_code,
      data.region || null,
      data.vintage || null,
      data.alcohol_content || null,
      data.serving_temperature || null,
      data.image_url || null,
      data.thumbnail_url || null,
      data.short_description || null,
      data.description || null,
      data.tasting_notes || null,
      data.pairing || null,
      data.search_keywords || null,
      id,
    ],
  );

  return findById(id);
}

export async function activate(id) {
  await db.query(
    `
    UPDATE wines
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
    UPDATE wines
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
    UPDATE wines
    SET active = false, deleted_at = CURRENT_TIMESTAMP
    WHERE id = ? AND deleted_at IS NULL
    `,
    [id],
  );

  return true;
}
