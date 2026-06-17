import { z } from "zod";
import { createHttpError } from "../../shared/utils/http-error.js";
import * as repository from "./restaurant-access-log.repository.js";

const schema = z.object({
  restaurant_id: z.coerce.number().int().positive(),
  wine_list_id: z.coerce.number().int().positive().optional().nullable(),
  ip_address: z.string().max(45).optional().nullable(),
  user_agent: z.string().optional().nullable(),
});

export async function createAccessLog(payload) {
  const data = schema.parse(payload);

  const restaurantExists = await repository.restaurantExists(
    data.restaurant_id,
  );

  if (!restaurantExists) {
    throw createHttpError("Restaurante não encontrado.", 404);
  }

  if (data.wine_list_id) {
    const wineListExists = await repository.wineListExists(data.wine_list_id);

    if (!wineListExists) {
      throw createHttpError("Carta de vinhos não encontrada.", 404);
    }
  }

  return repository.create(data);
}

export async function listAccessLogs(query) {
  return repository.findAll({
    restaurant_id: query.restaurant_id || null,
    wine_list_id: query.wine_list_id || null,
  });
}

export async function getAccessSummary(query) {
  return repository.summary({
    restaurant_id: query.restaurant_id || null,
    wine_list_id: query.wine_list_id || null,
  });
}
