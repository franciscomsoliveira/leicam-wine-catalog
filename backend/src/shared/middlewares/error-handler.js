export function errorHandler(error, req, res, next) {
  if (error.name === "ZodError") {
    return res.status(400).json({
      success: false,
      message: "Erro de validação.",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  console.error(error);

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Erro interno do servidor.",
  });
}
