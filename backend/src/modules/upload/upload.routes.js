import { Router } from "express";
import { createUpload } from "../../config/upload.js";
import { uploadFile } from "./upload.controller.js";

const router = Router();

const wineImageUpload = createUpload("uploads/wines/original");
const restaurantLogoUpload = createUpload("uploads/restaurants/logos");
const restaurantCoverUpload = createUpload("uploads/restaurants/covers");

router.post("/wine-image", wineImageUpload.single("image"), uploadFile);

router.post(
  "/restaurant-logo",
  restaurantLogoUpload.single("image"),
  uploadFile,
);

router.post(
  "/restaurant-cover",
  restaurantCoverUpload.single("image"),
  uploadFile,
);

export default router;
