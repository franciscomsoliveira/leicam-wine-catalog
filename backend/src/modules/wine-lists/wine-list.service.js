import { z } from "zod";
import { createSlug } from "../../shared/utils/create-slug.js";
import { createHttpError } from "../../shared/utils/http-error.js";
import * as repository from "./wine-list.repository.js";

const schema = z.object({
  restaurant_id: z.coerce.number().int().positive(),
  name: z.string().min(2).max(150),
  description: z.string().optional().nullable(),
  is_default: z.boolean().default(false),
  published: z.boolean().default(false),
});

export async function listWineLists(query) {
  return repository.findAll(query);
}

export async function getWineListById(id) {
  const wineList = await repository.findById(id);

  if (!wineList) {
    throw createHttpError("Carta não encontrada.", 404);
  }

  return wineList;
}

export async function createWineList(payload) {
  const data = schema.parse(payload);

  const restaurantExists = await repository.restaurantExists(
    data.restaurant_id,
  );

  if (!restaurantExists) {
    throw createHttpError("Restaurante não encontrado.", 404);
  }

  const slug = createSlug(data.name);

  const duplicated = await repository.findBySlug(data.restaurant_id, slug);

  if (duplicated) {
    throw createHttpError("Já existe uma carta com esse nome.", 409);
  }

  if (data.is_default) {
    await repository.clearDefaultRestaurantLists(data.restaurant_id);
  }

  return repository.create({
    ...data,
    slug,
  });
}

export async function updateWineList(id, payload) {
  const current = await getWineListById(id);

  const data = schema.parse({
    restaurant_id: current.restaurant_id,
    ...payload,
  });

  const slug = createSlug(data.name);

  if (data.is_default) {
    await repository.clearDefaultRestaurantLists(current.restaurant_id);
  }

  return repository.update(id, {
    ...data,
    slug,
  });
}

export async function activateWineList(id) {
  await getWineListById(id);
  return repository.activate(id);
}

export async function deactivateWineList(id) {
  await getWineListById(id);
  return repository.deactivate(id);
}

export async function publishWineList(id) {
  await getWineListById(id);
  return repository.publish(id);
}

export async function unpublishWineList(id) {
  await getWineListById(id);
  return repository.unpublish(id);
}

export async function deleteWineList(id) {
  await getWineListById(id);

  await repository.softDelete(id);

  return {
    deleted: true,
  };
}
