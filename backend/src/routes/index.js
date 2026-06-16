import { Router } from "express";
import wineStyleRoutes from "../modules/wine-styles/wine-style.routes.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "Rotas da API funcionando.",
  });
});

router.use("/wine-styles", wineStyleRoutes);

export default router;
