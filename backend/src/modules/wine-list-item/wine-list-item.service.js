import { z } from "zod";
import { createHttpError } from "../../shared/utils/http-error.js";
import * as repository from "./wine-list-item.repository.js";

const schema = z.object({
  wine_list_id: z.coerce.number().int().positive(),
  wine_id: z.coerce.number().int().positive(),

  bottle_price: z.coerce.number().min(0).optional().nullable(),
  glass_price: z.coerce.number().min(0).optional().nullable(),

  currency: z.string().length(3).default("BRL"),

  available: z.boolean().default(true),
  featured: z.boolean().default(false),
  display_order: z.coerce.number().int().min(0).default(0),
});

const updateSchema = z.object({
  bottle_price: z.coerce.number().min(0).optional().nullable(),
  glass_price: z.coerce.number().min(0).optional().nullable(),
  currency: z.string().length(3).default("BRL"),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
  display_order: z.coerce.number().int().min(0).default(0),
});

export async function listWineListItems(query) {
  return repository.findAll({
    wine_list_id: query.wine_list_id || null,
  });
}

export async function getWineListItemById(id) {
  const item = await repository.findById(id);

  if (!item) {
    throw createHttpError("Item da carta não encontrado.", 404);
  }

  return item;
}

export async function createWineListItem(payload) {
  const data = schema.parse(payload);

  const wineListExists = await repository.wineListExists(data.wine_list_id);

  if (!wineListExists) {
    throw createHttpError("Carta de vinhos não encontrada.", 404);
  }

  const wineExists = await repository.wineExists(data.wine_id);

  if (!wineExists) {
    throw createHttpError("Vinho não encontrado.", 404);
  }

  const duplicated = await repository.findDuplicate(
    data.wine_list_id,
    data.wine_id,
  );

  if (duplicated) {
    throw createHttpError("Este vinho já está nesta carta.", 409);
  }

  if (data.bottle_price == null && data.glass_price == null) {
    throw createHttpError("Informe preço da garrafa, da taça ou ambos.", 400);
  }

  return repository.create(data);
}

export async function updateWineListItem(id, payload) {
  await getWineListItemById(id);

  const data = updateSchema.parse(payload);

  if (data.bottle_price == null && data.glass_price == null) {
    throw createHttpError("Informe preço da garrafa, da taça ou ambos.", 400);
  }

  return repository.update(id, data);
}

export async function makeAvailable(id) {
  await getWineListItemById(id);
  return repository.setAvailable(id, true);
}

export async function makeUnavailable(id) {
  await getWineListItemById(id);
  return repository.setAvailable(id, false);
}

export async function makeFeatured(id) {
  await getWineListItemById(id);
  return repository.setFeatured(id, true);
}

export async function removeFeatured(id) {
  await getWineListItemById(id);
  return repository.setFeatured(id, false);
}

export async function deleteWineListItem(id) {
  await getWineListItemById(id);
  await repository.remove(id);

  return {
    deleted: true,
  };
}
