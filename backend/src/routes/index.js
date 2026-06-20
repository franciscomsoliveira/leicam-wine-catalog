import { Router } from "express";
import wineStyleRoutes from "../modules/wine-styles/wine-style.routes.js";
import grapeRoutes from "../modules/grapes/grape.routes.js";
import countryRoutes from "../modules/countries/country.routes.js";
import wineRoutes from "../modules/wines/wine.routes.js";
import restaurantRoutes from "../modules/restaurants/restaurant.routes.js";
import wineListRoutes from "../modules/wine-lists/wine-list.routes.js";
import wineListItemRoutes from "../modules/wine-list-item/wine-list-item.routes.js";
import wineGrapeRoutes from "../modules/wine-grape/wine-grape.routes.js";
import restaurantAccessLogRoutes from "../modules/restaurant-access-log/restaurant-access-log.routes.js";
import uploadRoutes from "../modules/upload/upload.routes.js";
import publicWineListRoutes from "../modules/public-wine-list/public-wine-list.routes.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "Rotas da API funcionando.",
  });
});

router.use("/wine-styles", wineStyleRoutes);
router.use("/grapes", grapeRoutes);
router.use("/countries", countryRoutes);
router.use("/wines", wineRoutes);
router.use("/restaurants", restaurantRoutes);
router.use("/wine-lists", wineListRoutes);
router.use("/wine-list-items", wineListItemRoutes);
router.use("/wine-grapes", wineGrapeRoutes);
router.use("/restaurant-access-logs", restaurantAccessLogRoutes);
router.use("/uploads", uploadRoutes);
router.use("/public", publicWineListRoutes);

export default router;
