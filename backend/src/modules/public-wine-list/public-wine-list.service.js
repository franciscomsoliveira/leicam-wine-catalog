import { getCountryByCode } from "../../shared/constants/countries.js";
import { createHttpError } from "../../shared/utils/http-error.js";
import * as repository from "./public-wine-list.repository.js";

function normalizeBoolean(value) {
  return Boolean(Number(value));
}

function groupGrapesByWineId(grapes = []) {
  return grapes.reduce((acc, grape) => {
    if (!acc[grape.wine_id]) {
      acc[grape.wine_id] = [];
    }

    acc[grape.wine_id].push({
      id: grape.grape_id,
      name: grape.name,
      slug: grape.slug,
      percentage: grape.percentage,
    });

    return acc;
  }, {});
}

function formatItem(item, grapesByWineId) {
  const country = getCountryByCode(item.country_code);

  return {
    id: item.id,
    wine_list_id: item.wine_list_id,
    wine_id: item.wine_id,
    bottle_price: item.bottle_price,
    glass_price: item.glass_price,
    currency: item.currency,
    available: normalizeBoolean(item.available),
    featured: normalizeBoolean(item.featured),
    display_order: item.display_order,
    wine: {
      id: item.wine_id,
      name: item.wine_name,
      slug: item.wine_slug,
      producer: item.producer,
      country_code: item.country_code,
      country_name: country?.name || item.country_code,
      region: item.region,
      vintage: item.vintage,
      alcohol_content: item.alcohol_content,
      serving_temperature: item.serving_temperature,
      image_url: item.image_url,
      thumbnail_url: item.thumbnail_url,
      short_description: item.short_description,
      description: item.description,
      tasting_notes: item.tasting_notes,
      pairing: item.pairing,
      style: {
        id: item.style_id,
        name: item.style_name,
        slug: item.style_slug,
      },
      grapes: grapesByWineId[item.wine_id] || [],
    },
  };
}

export async function getPublicWineList(slug, requestInfo = {}) {
  const restaurant = await repository.findRestaurantBySlug(slug);

  if (!restaurant) {
    throw createHttpError("Restaurante não encontrado ou inativo.", 404);
  }

  const wineList = await repository.findPublishedWineListByRestaurantId(
    restaurant.id,
  );

  if (!wineList) {
    throw createHttpError("Nenhuma carta publicada para este restaurante.", 404);
  }

  const items = await repository.findAvailableItemsByWineListId(wineList.id);
  const wineIds = items.map((item) => item.wine_id);
  const grapes = await repository.findGrapesByWineIds(wineIds);
  const grapesByWineId = groupGrapesByWineId(grapes);

  await repository.createAccessLog({
    restaurant_id: restaurant.id,
    wine_list_id: wineList.id,
    ip_address: requestInfo.ip_address,
    user_agent: requestInfo.user_agent,
  });

  return {
    restaurant: {
      ...restaurant,
      active: normalizeBoolean(restaurant.active),
    },
    wine_list: {
      ...wineList,
      is_default: normalizeBoolean(wineList.is_default),
      published: normalizeBoolean(wineList.published),
      active: normalizeBoolean(wineList.active),
    },
    items: items.map((item) => formatItem(item, grapesByWineId)),
  };
}
