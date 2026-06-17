import * as service from "./wine-grape.service.js";
import { successResponse } from "../../shared/utils/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";

export const index = asyncHandler(async (req, res) => {
  const data = await service.listWineGrapes(req.query.wine_id);

  return res.json(successResponse(data));
});

export const store = asyncHandler(async (req, res) => {
  const data = await service.createWineGrape(req.body);

  return res
    .status(201)
    .json(successResponse(data, "Uva associada ao vinho com sucesso."));
});

export const destroy = asyncHandler(async (req, res) => {
  const data = await service.deleteWineGrape(req.params.id);

  return res.json(successResponse(data, "Associação removida com sucesso."));
});
