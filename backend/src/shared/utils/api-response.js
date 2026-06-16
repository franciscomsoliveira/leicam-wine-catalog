export function successResponse(data = null, message = null) {
  return {
    success: true,
    message,
    data,
  };
}

export function errorResponse(message, errors = null) {
  return {
    success: false,
    message,
    errors,
  };
}
