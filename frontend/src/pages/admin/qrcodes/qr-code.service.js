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

export async function getRestaurantQRCode(restaurantId) {
  const response = await api.get(`/restaurants/${restaurantId}/qrcode`);
  return toEntity(response);
}

export async function getRestaurantQRCodes(restaurants = []) {
  const safeRestaurants = Array.isArray(restaurants) ? restaurants : [];

  const results = await Promise.all(
    safeRestaurants.map(async (restaurant) => {
      const qrCode = await getRestaurantQRCode(restaurant.id);

      return {
        ...restaurant,
        qrCode,
      };
    }),
  );

  return results;
}
