import * as service from "./wine-list-item.service.js";
import { successResponse } from "../../shared/utils/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";

export const index = asyncHandler(async (req, res) => {
  const data = await service.listWineListItems(req.query);
  return res.json(successResponse(data));
});

export const show = asyncHandler(async (req, res) => {
  const data = await service.getWineListItemById(req.params.id);
  return res.json(successResponse(data));
});

export const store = asyncHandler(async (req, res) => {
  const data = await service.createWineListItem(req.body);

  return res
    .status(201)
    .json(successResponse(data, "Vinho adicionado à carta com sucesso."));
});

export const update = asyncHandler(async (req, res) => {
  const data = await service.updateWineListItem(req.params.id, req.body);

  return res.json(
    successResponse(data, "Item da carta atualizado com sucesso."),
  );
});

export const available = asyncHandler(async (req, res) => {
  const data = await service.makeAvailable(req.params.id);

  return res.json(successResponse(data, "Item marcado como disponível."));
});

export const unavailable = asyncHandler(async (req, res) => {
  const data = await service.makeUnavailable(req.params.id);

  return res.json(successResponse(data, "Item marcado como indisponível."));
});

export const featured = asyncHandler(async (req, res) => {
  const data = await service.makeFeatured(req.params.id);

  return res.json(successResponse(data, "Item marcado como destaque."));
});

export const unfeatured = asyncHandler(async (req, res) => {
  const data = await service.removeFeatured(req.params.id);

  return res.json(successResponse(data, "Item removido dos destaques."));
});

export const destroy = asyncHandler(async (req, res) => {
  const data = await service.deleteWineListItem(req.params.id);

  return res.json(successResponse(data, "Item removido da carta com sucesso."));
});
