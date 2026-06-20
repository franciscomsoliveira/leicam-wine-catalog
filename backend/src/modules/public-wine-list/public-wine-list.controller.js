import * as service from "./public-wine-list.service.js";
import { successResponse } from "../../shared/utils/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";

export const showRestaurantWineList = asyncHandler(async (req, res) => {
  const data = await service.getPublicWineList(req.params.slug, {
    ip_address: req.ip,
    user_agent: req.headers["user-agent"],
  });

  return res.json(successResponse(data));
});
