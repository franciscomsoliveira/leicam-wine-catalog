import { z } from "zod";
import QRCode from "qrcode";
import { createSlug } from "../../shared/utils/create-slug.js";
import * as repository from "./restaurant.repository.js";

const restaurantSchema = z.object({
  name: z.string().min(2).max(150),
  logo_url: z.string().max(500).optional().nullable(),
  cover_url: z.string().max(500).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  address: z.string().optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
});

function normalizeBaseUrl(url) {
  return String(url || "").replace(/\/+$/, "");
}

function getPublicAppBaseUrl(req) {
  const configuredUrl =
    process.env.FRONTEND_URL ||
    process.env.PUBLIC_APP_URL ||
    process.env.FRONTEND_PUBLIC_URL;

  if (configuredUrl) {
    return normalizeBaseUrl(configuredUrl);
  }

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:5173";
  }

  return normalizeBaseUrl(`${req.protocol}://${req.get("host")}`);
}

function buildRestaurantPublicUrl(slug, req) {
  return `${getPublicAppBaseUrl(req)}/r/${slug}`;
}

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export async function listRestaurants(query) {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);

  return repository.findAll({
    page,
    limit,
    search: query.search || null,
    city: query.city || null,
  });
}

export async function getRestaurantById(id) {
  const restaurant = await repository.findById(id);

  if (!restaurant) {
    throw createHttpError("Restaurante não encontrado.", 404);
  }

  return restaurant;
}

export async function createRestaurant(payload) {
  const data = restaurantSchema.parse(payload);
  const slug = createSlug(data.name);

  const existing = await repository.findBySlug(slug);

  if (existing) {
    throw createHttpError("Já existe um restaurante com esse nome.", 409);
  }

  return repository.create({
    ...data,
    slug,
  });
}

export async function updateRestaurant(id, payload) {
  await getRestaurantById(id);

  const data = restaurantSchema.parse(payload);
  const slug = createSlug(data.name);

  const existing = await repository.findBySlug(slug);

  if (existing && Number(existing.id) !== Number(id)) {
    throw createHttpError("Já existe outro restaurante com esse nome.", 409);
  }

  return repository.update(id, {
    ...data,
    slug,
  });
}

export async function activateRestaurant(id) {
  await getRestaurantById(id);
  return repository.activate(id);
}

export async function deactivateRestaurant(id) {
  await getRestaurantById(id);
  return repository.deactivate(id);
}

export async function deleteRestaurant(id) {
  await getRestaurantById(id);
  await repository.softDelete(id);

  return {
    deleted: true,
  };
}

export async function generateRestaurantQRCode(id, req) {
  const restaurant = await getRestaurantById(id);
  const publicPath = `/r/${restaurant.slug}`;
  const publicUrl = buildRestaurantPublicUrl(restaurant.slug, req);

  const svg = await QRCode.toString(publicUrl, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 2,
    width: 360,
    color: {
      dark: "#181818",
      light: "#ffffff",
    },
  });

  return {
    restaurant: {
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      active: restaurant.active,
    },
    public_path: publicPath,
    public_url: publicUrl,
    svg,
  };
}
