import { z } from "zod";
import { createHttpError } from "../../shared/utils/http-error.js";
import * as repository from "./wine-grape.repository.js";

const schema = z.object({
  wine_id: z.coerce.number().int().positive(),
  grape_id: z.coerce.number().int().positive(),
  percentage: z.coerce.number().min(0).max(100).optional().nullable(),
});

export async function listWineGrapes(wineId) {
  return repository.findAllByWineId(wineId);
}

export async function createWineGrape(payload) {
  const data = schema.parse(payload);

  const wineExists = await repository.wineExists(data.wine_id);

  if (!wineExists) {
    throw createHttpError("Vinho não encontrado.", 404);
  }

  const grapeExists = await repository.grapeExists(data.grape_id);

  if (!grapeExists) {
    throw createHttpError("Uva não encontrada.", 404);
  }

  const duplicated = await repository.findDuplicate(
    data.wine_id,
    data.grape_id,
  );

  if (duplicated) {
    throw createHttpError("Esta uva já está associada ao vinho.", 409);
  }

  return repository.create(data);
}

export async function deleteWineGrape(id) {
  const item = await repository.findById(id);

  if (!item) {
    throw createHttpError("Associação não encontrada.", 404);
  }

  await repository.remove(id);

  return {
    deleted: true,
  };
}
