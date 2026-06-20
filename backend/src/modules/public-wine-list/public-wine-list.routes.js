import { Router } from "express";
import * as controller from "./public-wine-list.controller.js";

const router = Router();

router.get("/restaurants/:slug/wine-list", controller.showRestaurantWineList);

export default router;
