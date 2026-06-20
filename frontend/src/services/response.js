export function unwrapResponse(responseOrData) {
  return responseOrData?.data?.data ?? responseOrData?.data ?? responseOrData ?? null;
}

export function toArray(value) {
  const payload = unwrapResponse(value);

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.rows)) return payload.rows;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;

  return [];
}

export function toEntity(value) {
  return unwrapResponse(value);
}

export function getApiMessage(error, fallback = "Erro inesperado.") {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}
