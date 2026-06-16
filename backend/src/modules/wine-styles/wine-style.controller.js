import * as service from "./wine-style.service.js";
import { successResponse } from "../../shared/utils/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";

export const index = asyncHandler(async (req, res) => {
  const data = await service.listWineStyles();
  return res.json(successResponse(data));
});

export const show = asyncHandler(async (req, res) => {
  const data = await service.getWineStyleById(req.params.id);
  return res.json(successResponse(data));
});

export const store = asyncHandler(async (req, res) => {
  const data = await service.createWineStyle(req.body);

  return res
    .status(201)
    .json(successResponse(data, "Estilo de vinho criado com sucesso."));
});

export const update = asyncHandler(async (req, res) => {
  const data = await service.updateWineStyle(req.params.id, req.body);

  return res.json(
    successResponse(data, "Estilo de vinho atualizado com sucesso."),
  );
});

export const activate = asyncHandler(async (req, res) => {
  const data = await service.activateWineStyle(req.params.id);

  return res.json(
    successResponse(data, "Estilo de vinho ativado com sucesso."),
  );
});

export const deactivate = asyncHandler(async (req, res) => {
  const data = await service.deactivateWineStyle(req.params.id);

  return res.json(
    successResponse(data, "Estilo de vinho desativado com sucesso."),
  );
});

export const destroy = asyncHandler(async (req, res) => {
  const data = await service.deleteWineStyle(req.params.id);

  return res.json(
    successResponse(data, "Estilo de vinho removido com sucesso."),
  );
});
