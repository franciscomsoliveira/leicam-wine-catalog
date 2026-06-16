import { z } from "zod";
import { createSlug } from "../../shared/utils/create-slug.js";
import * as repository from "./wine-style.repository.js";

const wineStyleSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres.").max(80),
  description: z.string().max(500).optional().nullable(),
});

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export async function listWineStyles() {
  return repository.findAll();
}

export async function getWineStyleById(id) {
  const wineStyle = await repository.findById(id);

  if (!wineStyle) {
    throw createHttpError("Estilo de vinho não encontrado.", 404);
  }

  return wineStyle;
}

export async function createWineStyle(payload) {
  const data = wineStyleSchema.parse(payload);
  const slug = createSlug(data.name);

  const existing = await repository.findBySlug(slug);

  if (existing) {
    throw createHttpError("Já existe um estilo de vinho com esse nome.", 409);
  }

  return repository.create({
    ...data,
    slug,
  });
}

export async function updateWineStyle(id, payload) {
  await getWineStyleById(id);

  const data = wineStyleSchema.parse(payload);
  const slug = createSlug(data.name);

  const existing = await repository.findBySlug(slug);

  if (existing && Number(existing.id) !== Number(id)) {
    throw createHttpError(
      "Já existe outro estilo de vinho com esse nome.",
      409,
    );
  }

  return repository.update(id, {
    ...data,
    slug,
  });
}

export async function activateWineStyle(id) {
  await getWineStyleById(id);
  return repository.activate(id);
}

export async function deactivateWineStyle(id) {
  await getWineStyleById(id);
  return repository.deactivate(id);
}

export async function deleteWineStyle(id) {
  await getWineStyleById(id);
  await repository.softDelete(id);

  return {
    deleted: true,
  };
}
