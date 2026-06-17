import { Router } from "express";
import * as controller from "./restaurant-access-log.controller.js";

const router = Router();

router.get("/", controller.index);
router.get("/summary", controller.summary);
router.post("/", controller.store);

export default router;
