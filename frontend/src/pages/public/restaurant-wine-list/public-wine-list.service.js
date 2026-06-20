import api from "../../../services/api";
import { getStaticFileUrl } from "../../../services/assets";
import { toEntity } from "../../../services/response";

export async function getPublicWineList(slug) {
  const response = await api.get(`/public/restaurants/${slug}/wine-list`);
  return toEntity(response);
}

export function resolveAssetUrl(url) {
  return getStaticFileUrl(url);
}
