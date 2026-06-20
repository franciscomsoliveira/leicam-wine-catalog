import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function createStorage(folder) {
  return multer.diskStorage({
    destination: (req, file, callback) => {
      ensureDirExists(folder);
      callback(null, folder);
    },

    filename: (req, file, callback) => {
      const hash = crypto.randomBytes(16).toString("hex");
      const ext = path.extname(file.originalname).toLowerCase();

      callback(null, `${hash}${ext}`);
    },
  });
}

function imageFilter(req, file, callback) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.mimetype)) {
    return callback(new Error("Formato de imagem não permitido."));
  }

  callback(null, true);
}

export function createUpload(folder) {
  return multer({
    storage: createStorage(folder),
    limits: {
      fileSize: Number(process.env.MAX_FILE_SIZE_MB || 5) * 1024 * 1024,
    },
    fileFilter: imageFilter,
  });
}
