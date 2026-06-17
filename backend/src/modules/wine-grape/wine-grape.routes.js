import { Router } from "express";
import * as controller from "./wine-grape.controller.js";

const router = Router();

router.get("/", controller.index);
router.post("/", controller.store);
router.delete("/:id", controller.destroy);

export default router;
