import * as service from "./restaurant-access-log.service.js";
import { successResponse } from "../../shared/utils/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";

export const store = asyncHandler(async (req, res) => {
  const data = await service.createAccessLog({
    ...req.body,
    ip_address: req.ip,
    user_agent: req.headers["user-agent"],
  });

  return res
    .status(201)
    .json(successResponse(data, "Acesso registrado com sucesso."));
});

export const index = asyncHandler(async (req, res) => {
  const data = await service.listAccessLogs(req.query);
  return res.json(successResponse(data));
});

export const summary = asyncHandler(async (req, res) => {
  const data = await service.getAccessSummary(req.query);
  return res.json(successResponse(data));
});
