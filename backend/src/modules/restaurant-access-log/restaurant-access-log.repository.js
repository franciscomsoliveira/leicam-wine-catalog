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

export async function create(data) {
  const [result] = await db.query(
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
      data.restaurant_id,
      data.wine_list_id || null,
      data.ip_address || null,
      data.user_agent || null,
    ],
  );

  return findById(result.insertId);
}

export async function findById(id) {
  const [rows] = await db.query(
    `
    SELECT *
    FROM restaurant_access_logs
    WHERE id = ?
    LIMIT 1
    `,
    [id],
  );

  return rows[0];
}

export async function findAll({ restaurant_id, wine_list_id }) {
  const conditions = ["1 = 1"];
  const params = [];

  if (restaurant_id) {
    conditions.push("ral.restaurant_id = ?");
    params.push(restaurant_id);
  }

  if (wine_list_id) {
    conditions.push("ral.wine_list_id = ?");
    params.push(wine_list_id);
  }

  const [rows] = await db.query(
    `
    SELECT
      ral.*,
      r.name AS restaurant_name,
      wl.name AS wine_list_name
    FROM restaurant_access_logs ral
    INNER JOIN restaurants r ON r.id = ral.restaurant_id
    LEFT JOIN wine_lists wl ON wl.id = ral.wine_list_id
    WHERE ${conditions.join(" AND ")}
    ORDER BY ral.accessed_at DESC
    LIMIT 500
    `,
    params,
  );

  return rows;
}

export async function summary({ restaurant_id, wine_list_id }) {
  const conditions = ["1 = 1"];
  const params = [];

  if (restaurant_id) {
    conditions.push("restaurant_id = ?");
    params.push(restaurant_id);
  }

  if (wine_list_id) {
    conditions.push("wine_list_id = ?");
    params.push(wine_list_id);
  }

  const where = conditions.join(" AND ");

  const [totalRows] = await db.query(
    `
    SELECT COUNT(*) AS total_accesses
    FROM restaurant_access_logs
    WHERE ${where}
    `,
    params,
  );

  const [dailyRows] = await db.query(
    `
    SELECT
      DATE(accessed_at) AS access_date,
      COUNT(*) AS total_accesses
    FROM restaurant_access_logs
    WHERE ${where}
    GROUP BY DATE(accessed_at)
    ORDER BY access_date DESC
    LIMIT 30
    `,
    params,
  );

  return {
    total_accesses: totalRows[0].total_accesses,
    daily: dailyRows,
  };
}
