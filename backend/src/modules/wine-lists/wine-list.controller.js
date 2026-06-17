import * as service from "./wine-list.service.js";
import { successResponse } from "../../shared/utils/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";

export const index = asyncHandler(async (req, res) => {
  const data = await service.listWineLists(req.query);
  return res.json(successResponse(data));
});

export const show = asyncHandler(async (req, res) => {
  const data = await service.getWineListById(req.params.id);
  return res.json(successResponse(data));
});

export const store = asyncHandler(async (req, res) => {
  const data = await service.createWineList(req.body);

  return res
    .status(201)
    .json(successResponse(data, "Carta criada com sucesso."));
});

export const update = asyncHandler(async (req, res) => {
  const data = await service.updateWineList(req.params.id, req.body);

  return res.json(successResponse(data, "Carta atualizada com sucesso."));
});

export const activate = asyncHandler(async (req, res) => {
  const data = await service.activateWineList(req.params.id);

  return res.json(successResponse(data));
});

export const deactivate = asyncHandler(async (req, res) => {
  const data = await service.deactivateWineList(req.params.id);

  return res.json(successResponse(data));
});

export const publish = asyncHandler(async (req, res) => {
  const data = await service.publishWineList(req.params.id);

  return res.json(successResponse(data));
});

export const unpublish = asyncHandler(async (req, res) => {
  const data = await service.unpublishWineList(req.params.id);

  return res.json(successResponse(data));
});

export const destroy = asyncHandler(async (req, res) => {
  const data = await service.deleteWineList(req.params.id);

  return res.json(successResponse(data));
});
