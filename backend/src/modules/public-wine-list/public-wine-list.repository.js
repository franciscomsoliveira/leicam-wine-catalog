import { db } from "../../database/connection.js";

export async function findRestaurantBySlug(slug) {
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
      active
    FROM restaurants
    WHERE slug = ?
      AND active = true
      AND deleted_at IS NULL
    LIMIT 1
    `,
    [slug],
  );

  return rows[0];
}

export async function findPublishedWineListByRestaurantId(restaurantId) {
  const [rows] = await db.query(
    `
    SELECT
      id,
      restaurant_id,
      name,
      slug,
      description,
      is_default,
      published,
      active,
      created_at,
      updated_at
    FROM wine_lists
    WHERE restaurant_id = ?
      AND active = true
      AND published = true
      AND deleted_at IS NULL
    ORDER BY is_default DESC, id DESC
    LIMIT 1
    `,
    [restaurantId],
  );

  return rows[0];
}

export async function findAvailableItemsByWineListId(wineListId) {
  const [rows] = await db.query(
    `
    SELECT
      wli.id,
      wli.wine_list_id,
      wli.wine_id,
      wli.bottle_price,
      wli.glass_price,
      wli.currency,
      wli.available,
      wli.featured,
      wli.display_order,
      w.id AS wine_id,
      w.name AS wine_name,
      w.slug AS wine_slug,
      w.producer,
      w.country_code,
      w.region,
      w.vintage,
      w.alcohol_content,
      w.serving_temperature,
      w.image_url,
      w.thumbnail_url,
      w.short_description,
      w.description,
      w.tasting_notes,
      w.pairing,
      ws.id AS style_id,
      ws.name AS style_name,
      ws.slug AS style_slug
    FROM wine_list_items wli
    INNER JOIN wines w
      ON w.id = wli.wine_id
    INNER JOIN wine_styles ws
      ON ws.id = w.style_id
    WHERE wli.wine_list_id = ?
      AND wli.available = true
      AND w.active = true
      AND w.deleted_at IS NULL
    ORDER BY wli.display_order ASC, w.name ASC
    `,
    [wineListId],
  );

  return rows;
}

export async function findGrapesByWineIds(wineIds = []) {
  if (!wineIds.length) return [];

  const placeholders = wineIds.map(() => "?").join(", ");

  const [rows] = await db.query(
    `
    SELECT
      wg.wine_id,
      wg.grape_id,
      wg.percentage,
      g.name,
      g.slug
    FROM wine_grapes wg
    INNER JOIN grapes g
      ON g.id = wg.grape_id
    WHERE wg.wine_id IN (${placeholders})
      AND g.active = true
      AND g.deleted_at IS NULL
    ORDER BY g.name ASC
    `,
    wineIds,
  );

  return rows;
}

export async function createAccessLog({ restaurant_id, wine_list_id, ip_address, user_agent }) {
  await db.query(
    `
    INSERT INTO restaurant_access_logs (
      restaurant_id,
      wine_list_id,
      ip_address,
      user_agent
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      restaurant_id,
      wine_list_id || null,
      ip_address || null,
      user_agent || null,
    ],
  );
}
