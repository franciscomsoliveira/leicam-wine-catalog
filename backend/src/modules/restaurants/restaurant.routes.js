import { Router } from "express";
import * as controller from "./restaurant.controller.js";

const router = Router();

router.get("/", controller.index);
router.get("/:id/qrcode", controller.qrcode);
router.get("/:id", controller.show);
router.post("/", controller.store);
router.put("/:id", controller.update);
router.patch("/:id/activate", controller.activate);
router.patch("/:id/deactivate", controller.deactivate);
router.delete("/:id", controller.destroy);

export default router;
