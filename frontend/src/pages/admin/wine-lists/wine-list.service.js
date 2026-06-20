import api from "../../../services/api";
import { toArray, toEntity } from "../../../services/response";

export async function getRestaurants() {
  const response = await api.get("/restaurants", {
    params: {
      limit: 500,
    },
  });

  return toArray(response);
}

export async function getWines() {
  const response = await api.get("/wines", {
    params: {
      limit: 500,
    },
  });

  return toArray(response);
}

export async function getWineLists(params = {}) {
  const response = await api.get("/wine-lists", { params });
  return toArray(response);
}

export async function getWineListItems(wineListId) {
  if (!wineListId) return [];

  const response = await api.get("/wine-list-items", {
    params: {
      wine_list_id: wineListId,
    },
  });

  return toArray(response);
}

export async function createWineList(payload) {
  const response = await api.post("/wine-lists", payload);
  return toEntity(response);
}

export async function publishWineList(id) {
  const response = await api.patch(`/wine-lists/${id}/publish`);
  return toEntity(response);
}

export async function unpublishWineList(id) {
  const response = await api.patch(`/wine-lists/${id}/unpublish`);
  return toEntity(response);
}

export async function activateWineList(id) {
  const response = await api.patch(`/wine-lists/${id}/activate`);
  return toEntity(response);
}

export async function deactivateWineList(id) {
  const response = await api.patch(`/wine-lists/${id}/deactivate`);
  return toEntity(response);
}

export async function createWineListItem(payload) {
  const response = await api.post("/wine-list-items", payload);
  return toEntity(response);
}

export async function updateWineListItem(id, payload) {
  const response = await api.patch(`/wine-list-items/${id}`, payload);
  return toEntity(response);
}

export async function makeWineListItemAvailable(id) {
  const response = await api.patch(`/wine-list-items/${id}/available`);
  return toEntity(response);
}

export async function makeWineListItemUnavailable(id) {
  const response = await api.patch(`/wine-list-items/${id}/unavailable`);
  return toEntity(response);
}

export async function makeWineListItemFeatured(id) {
  const response = await api.patch(`/wine-list-items/${id}/featured`);
  return toEntity(response);
}

export async function makeWineListItemUnfeatured(id) {
  const response = await api.patch(`/wine-list-items/${id}/unfeatured`);
  return toEntity(response);
}

export async function deleteWineListItem(id) {
  const response = await api.delete(`/wine-list-items/${id}`);
  return toEntity(response);
}
