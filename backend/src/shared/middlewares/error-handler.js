export function errorHandler(error, req, res, next) {
  if (error.name === "ZodError") {
    return res.status(400).json({
      message: "Erro de validação.",
      errors: error.errors,
    });
  }

  console.error(error);

  return res.status(error.statusCode || 500).json({
    message: error.message || "Erro interno do servidor.",
  });
}
