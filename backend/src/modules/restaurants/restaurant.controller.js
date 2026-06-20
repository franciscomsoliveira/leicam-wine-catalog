import * as service from "./restaurant.service.js";
import { successResponse } from "../../shared/utils/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";

export const index = asyncHandler(async (req, res) => {
  const data = await service.listRestaurants(req.query);
  return res.json(successResponse(data));
});

export const show = asyncHandler(async (req, res) => {
  const data = await service.getRestaurantById(req.params.id);
  return res.json(successResponse(data));
});

export const store = asyncHandler(async (req, res) => {
  const data = await service.createRestaurant(req.body);

  return res
    .status(201)
    .json(successResponse(data, "Restaurante criado com sucesso."));
});

export const update = asyncHandler(async (req, res) => {
  const data = await service.updateRestaurant(req.params.id, req.body);

  return res.json(successResponse(data, "Restaurante atualizado com sucesso."));
});

export const activate = asyncHandler(async (req, res) => {
  const data = await service.activateRestaurant(req.params.id);

  return res.json(successResponse(data, "Restaurante ativado com sucesso."));
});

export const deactivate = asyncHandler(async (req, res) => {
  const data = await service.deactivateRestaurant(req.params.id);

  return res.json(successResponse(data, "Restaurante desativado com sucesso."));
});

export const destroy = asyncHandler(async (req, res) => {
  const data = await service.deleteRestaurant(req.params.id);

  return res.json(successResponse(data, "Restaurante removido com sucesso."));
});


export const qrcode = asyncHandler(async (req, res) => {
  const data = await service.generateRestaurantQRCode(req.params.id, req);

  return res.json(successResponse(data));
});
