import * as service from "./wine.service.js";
import { successResponse } from "../../shared/utils/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";

export const index = asyncHandler(async (req, res) => {
  const data = await service.listWines(req.query);
  return res.json(successResponse(data));
});

export const show = asyncHandler(async (req, res) => {
  const data = await service.getWineById(req.params.id);
  return res.json(successResponse(data));
});

export const store = asyncHandler(async (req, res) => {
  console.log("BODY RECEBIDO:", req.body);
  const data = await service.createWine(req.body);

  return res
    .status(201)
    .json(successResponse(data, "Vinho criado com sucesso."));
});

export const update = asyncHandler(async (req, res) => {
  const data = await service.updateWine(req.params.id, req.body);

  return res.json(successResponse(data, "Vinho atualizado com sucesso."));
});

export const activate = asyncHandler(async (req, res) => {
  const data = await service.activateWine(req.params.id);

  return res.json(successResponse(data, "Vinho ativado com sucesso."));
});

export const deactivate = asyncHandler(async (req, res) => {
  const data = await service.deactivateWine(req.params.id);

  return res.json(successResponse(data, "Vinho desativado com sucesso."));
});

export const destroy = asyncHandler(async (req, res) => {
  const data = await service.deleteWine(req.params.id);

  return res.json(successResponse(data, "Vinho removido com sucesso."));
});
