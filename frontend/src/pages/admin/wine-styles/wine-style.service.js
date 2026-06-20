import api from "../../../services/api";
import { toArray, toEntity } from "../../../services/response";

export async function getWineStyles(params = {}) {
  const response = await api.get("/wine-styles", { params });
  return toArray(response);
}

export async function createWineStyle(payload) {
  const response = await api.post("/wine-styles", payload);
  return toEntity(response);
}
