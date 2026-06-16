import { z } from "zod";
import { createSlug } from "../../shared/utils/create-slug.js";
import * as repository from "./grape.repository.js";

const grapeSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres.").max(120),
  description: z.string().max(500).optional().nullable(),
});

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export async function listGrapes() {
  return repository.findAll();
}

export async function getGrapeById(id) {
  const grape = await repository.findById(id);

  if (!grape) {
    throw createHttpError("Uva não encontrada.", 404);
  }

  return grape;
}

export async function createGrape(payload) {
  const data = grapeSchema.parse(payload);
  const slug = createSlug(data.name);

  const existing = await repository.findBySlug(slug);

  if (existing) {
    throw createHttpError("Já existe uma uva com esse nome.", 409);
  }

  return repository.create({
    ...data,
    slug,
  });
}

export async function updateGrape(id, payload) {
  await getGrapeById(id);

  const data = grapeSchema.parse(payload);
  const slug = createSlug(data.name);

  const existing = await repository.findBySlug(slug);

  if (existing && Number(existing.id) !== Number(id)) {
    throw createHttpError("Já existe outra uva com esse nome.", 409);
  }

  return repository.update(id, {
    ...data,
    slug,
  });
}

export async function activateGrape(id) {
  await getGrapeById(id);
  return repository.activate(id);
}

export async function deactivateGrape(id) {
  await getGrapeById(id);
  return repository.deactivate(id);
}

export async function deleteGrape(id) {
  await getGrapeById(id);
  await repository.softDelete(id);

  return {
    deleted: true,
  };
}
