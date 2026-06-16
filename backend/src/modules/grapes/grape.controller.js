import * as service from "./grape.service.js";
import { successResponse } from "../../shared/utils/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";

export const index = asyncHandler(async (req, res) => {
  const data = await service.listGrapes();
  return res.json(successResponse(data));
});

export const show = asyncHandler(async (req, res) => {
  const data = await service.getGrapeById(req.params.id);
  return res.json(successResponse(data));
});

export const store = asyncHandler(async (req, res) => {
  const data = await service.createGrape(req.body);

  return res.status(201).json(successResponse(data, "Uva criada com sucesso."));
});

export const update = asyncHandler(async (req, res) => {
  const data = await service.updateGrape(req.params.id, req.body);

  return res.json(successResponse(data, "Uva atualizada com sucesso."));
});

export const activate = asyncHandler(async (req, res) => {
  const data = await service.activateGrape(req.params.id);

  return res.json(successResponse(data, "Uva ativada com sucesso."));
});

export const deactivate = asyncHandler(async (req, res) => {
  const data = await service.deactivateGrape(req.params.id);

  return res.json(successResponse(data, "Uva desativada com sucesso."));
});

export const destroy = asyncHandler(async (req, res) => {
  const data = await service.deleteGrape(req.params.id);

  return res.json(successResponse(data, "Uva removida com sucesso."));
});
