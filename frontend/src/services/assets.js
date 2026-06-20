import api from "./api";

export function getBackendBaseUrl() {
  const apiBaseUrl = api.defaults.baseURL || "http://localhost:3333/api";
  return apiBaseUrl.replace(/\/api\/?$/, "");
}

export function getStaticFileUrl(fileUrl) {
  if (!fileUrl) return "";

  if (
    fileUrl.startsWith("http") ||
    fileUrl.startsWith("blob:") ||
    fileUrl.startsWith("data:")
  ) {
    return fileUrl;
  }

  const cleanFileUrl = fileUrl.replace(/^\/+/, "");
  return `${getBackendBaseUrl()}/${cleanFileUrl}`;
}

export function getImageUrl(imageUrl) {
  return getStaticFileUrl(imageUrl);
}
