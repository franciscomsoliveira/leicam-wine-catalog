import api from "../../../services/api";
import { toArray, toEntity } from "../../../services/response";

export async function getRestaurants(params = {}) {
  const response = await api.get("/restaurants", { params });
  return toArray(response);
}

export async function createRestaurant(payload) {
  const response = await api.post("/restaurants", payload);
  return toEntity(response);
}
