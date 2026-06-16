import { Router } from "express";
import { COUNTRIES } from "../../shared/constants/countries.js";
import { successResponse } from "../../shared/utils/api-response.js";

const router = Router();

router.get("/", (req, res) => {
  return res.json(successResponse(COUNTRIES));
});

export default router;
