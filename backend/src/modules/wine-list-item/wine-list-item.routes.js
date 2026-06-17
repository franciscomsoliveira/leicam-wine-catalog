import { Router } from "express";
import * as controller from "./wine-list-item.controller.js";

const router = Router();

router.get("/", controller.index);
router.get("/:id", controller.show);

router.post("/", controller.store);
router.put("/:id", controller.update);

router.patch("/:id/available", controller.available);
router.patch("/:id/unavailable", controller.unavailable);

router.patch("/:id/featured", controller.featured);
router.patch("/:id/unfeatured", controller.unfeatured);

router.delete("/:id", controller.destroy);

export default router;
