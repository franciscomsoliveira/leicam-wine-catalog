import { successResponse } from "../../shared/utils/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";

export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Nenhum arquivo enviado.",
    });
  }

  const fileUrl = `/${req.file.path.replaceAll("\\", "/")}`;

  return res.status(201).json(
    successResponse(
      {
        filename: req.file.filename,
        path: req.file.path,
        url: fileUrl,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
      "Upload realizado com sucesso.",
    ),
  );
});
