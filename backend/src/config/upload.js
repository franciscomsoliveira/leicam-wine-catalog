import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/");
  },

  filename: (req, file, callback) => {
    const hash = crypto.randomBytes(16).toString("hex");
    const ext = path.extname(file.originalname);

    callback(null, `${hash}${ext}`);
  },
});

export const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, callback) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new Error("Formato de imagem não permitido."));
    }

    callback(null, true);
  },
});
