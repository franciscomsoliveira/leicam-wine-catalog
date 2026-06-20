import api from "../../../services/api";
import { getImageUrl, getStaticFileUrl } from "../../../services/assets";
import { toArray, toEntity } from "../../../services/response";

export async function getWines(params = {}) {
  const response = await api.get("/wines", { params });
  return toArray(response);
}

export async function getWineById(id) {
  const response = await api.get(`/wines/${id}`);
  return toEntity(response);
}

export async function getWineStyles() {
  const response = await api.get("/wine-styles", {
    params: {
      limit: 500,
    },
  });

  return toArray(response);
}

export async function getCountries() {
  const response = await api.get("/countries");
  return toArray(response);
}

export async function getGrapes() {
  const response = await api.get("/grapes", {
    params: {
      limit: 500,
    },
  });

  return toArray(response);
}

export async function getWineFormOptions() {
  const [styles, countries, grapes] = await Promise.all([
    getWineStyles(),
    getCountries(),
    getGrapes(),
  ]);

  return {
    styles,
    countries,
    grapes,
  };
}

export async function uploadWineImage(file) {
  if (!file) return null;

  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/uploads/wine-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const data = toEntity(response);

  return (
    data?.url ||
    data?.image_url ||
    data?.imageUrl ||
    data?.path ||
    null
  );
}

export async function createWine(payload) {
  const response = await api.post("/wines", payload);
  return toEntity(response);
}

export async function updateWine(id, payload) {
  const response = await api.put(`/wines/${id}`, payload);
  return toEntity(response);
}

export async function deleteWine(id) {
  const response = await api.delete(`/wines/${id}`);
  return toEntity(response);
}

export async function activateWine(id) {
  const response = await api.patch(`/wines/${id}/activate`);
  return toEntity(response);
}

export async function deactivateWine(id) {
  const response = await api.patch(`/wines/${id}/deactivate`);
  return toEntity(response);
}

export async function getWineGrapes(wineId) {
  if (!wineId) return [];

  const response = await api.get("/wine-grapes", {
    params: {
      wine_id: wineId,
    },
  });

  return toArray(response);
}

export async function attachGrapesToWine(wineId, grapeIds = []) {
  const safeGrapeIds = Array.isArray(grapeIds) ? grapeIds : [];

  if (!wineId || safeGrapeIds.length === 0) return;

  await Promise.all(
    safeGrapeIds.map((grapeId) =>
      api.post("/wine-grapes", {
        wine_id: Number(wineId),
        grape_id: Number(grapeId),
      }),
    ),
  );
}

export async function syncWineGrapes(wineId, grapeIds = []) {
  if (!wineId) return;

  const nextGrapeIds = (Array.isArray(grapeIds) ? grapeIds : [])
    .map(Number)
    .filter(Boolean);

  const currentGrapes = await getWineGrapes(wineId);
  const currentGrapeIds = currentGrapes.map((item) => Number(item.grape_id));

  const grapeIdsToAdd = nextGrapeIds.filter(
    (grapeId) => !currentGrapeIds.includes(grapeId),
  );

  const associationsToDelete = currentGrapes.filter(
    (item) => !nextGrapeIds.includes(Number(item.grape_id)),
  );

  await Promise.all([
    ...grapeIdsToAdd.map((grapeId) =>
      api.post("/wine-grapes", {
        wine_id: Number(wineId),
        grape_id: Number(grapeId),
      }),
    ),
    ...associationsToDelete.map((item) => api.delete(`/wine-grapes/${item.id}`)),
  ]);
}

export function getCreatedWineId(createdWine) {
  return (
    createdWine?.id ||
    createdWine?.wine_id ||
    createdWine?.insertId ||
    createdWine?.wine?.id ||
    createdWine?.data?.id ||
    createdWine?.data?.wine?.id
  );
}

export { getImageUrl, getStaticFileUrl };
