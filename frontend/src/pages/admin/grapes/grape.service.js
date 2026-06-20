import api from "../../../services/api";
import { toArray, toEntity } from "../../../services/response";

export async function getGrapes(params = {}) {
  const response = await api.get("/grapes", { params });
  return toArray(response);
}

export async function createGrape(payload) {
  const response = await api.post("/grapes", payload);
  return toEntity(response);
}
