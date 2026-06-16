import { z } from "zod";
import { createSlug } from "../../shared/utils/create-slug.js";
import { countryExists } from "../../shared/constants/countries.js";
import * as repository from "./wine.repository.js";

const wineSchema = z.object({
  name: z.string().min(2).max(180),
  producer: z.string().min(2).max(150),
  style_id: z.coerce.number().int().positive(),
  country_code: z.string().length(2),

  region: z.string().max(120).optional().nullable(),
  vintage: z.string().max(20).optional().nullable(),
  alcohol_content: z.coerce.number().min(0).max(99).optional().nullable(),
  serving_temperature: z.string().max(50).optional().nullable(),

  image_url: z.string().max(500).optional().nullable(),
  thumbnail_url: z.string().max(500).optional().nullable(),

  short_description: z.string().max(255).optional().nullable(),
  description: z.string().optional().nullable(),
  tasting_notes: z.string().optional().nullable(),
  pairing: z.string().optional().nullable(),
  search_keywords: z.string().optional().nullable(),
});

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizePayload(payload = {}) {
  return {
    ...payload,
    country_code: payload.country_code?.toUpperCase(),
  };
}

function createWineSlug(data) {
  return createSlug(`${data.name}-${data.producer}-${data.vintage || ""}`);
}

export async function listWines(query) {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);

  return repository.findAll({
    page,
    limit,
    search: query.search || null,
    style_id: query.style_id || null,
    country_code: query.country_code || null,
  });
}

export async function getWineById(id) {
  const wine = await repository.findById(id);

  if (!wine) {
    throw createHttpError("Vinho não encontrado.", 404);
  }

  return wine;
}

export async function createWine(payload) {
  const data = wineSchema.parse(normalizePayload(payload));

  if (!countryExists(data.country_code)) {
    throw createHttpError("País informado é inválido.", 400);
  }

  const styleExists = await repository.styleExists(data.style_id);

  if (!styleExists) {
    throw createHttpError("Estilo de vinho informado é inválido.", 400);
  }

  const duplicated = await repository.findByNameAndProducer(
    data.name,
    data.producer,
  );

  if (duplicated) {
    throw createHttpError("Já existe um vinho com esse nome e produtor.", 409);
  }

  const slug = createWineSlug(data);

  const existingSlug = await repository.findBySlug(slug);

  if (existingSlug) {
    throw createHttpError("Já existe um vinho com esse slug.", 409);
  }

  return repository.create({
    ...data,
    slug,
  });
}

export async function updateWine(id, payload) {
  await getWineById(id);

  const data = wineSchema.parse(normalizePayload(payload));

  if (!countryExists(data.country_code)) {
    throw createHttpError("País informado é inválido.", 400);
  }

  const styleExists = await repository.styleExists(data.style_id);

  if (!styleExists) {
    throw createHttpError("Estilo de vinho informado é inválido.", 400);
  }

  const duplicated = await repository.findByNameAndProducer(
    data.name,
    data.producer,
  );

  if (duplicated && Number(duplicated.id) !== Number(id)) {
    throw createHttpError(
      "Já existe outro vinho com esse nome e produtor.",
      409,
    );
  }

  const slug = createWineSlug(data);

  const existingSlug = await repository.findBySlug(slug);

  if (existingSlug && Number(existingSlug.id) !== Number(id)) {
    throw createHttpError("Já existe outro vinho com esse slug.", 409);
  }

  return repository.update(id, {
    ...data,
    slug,
  });
}

export async function activateWine(id) {
  await getWineById(id);
  return repository.activate(id);
}

export async function deactivateWine(id) {
  await getWineById(id);
  return repository.deactivate(id);
}

export async function deleteWine(id) {
  await getWineById(id);
  await repository.softDelete(id);

  return {
    deleted: true,
  };
}
