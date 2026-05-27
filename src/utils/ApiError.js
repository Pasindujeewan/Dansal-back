// this is generic error format for all api errors

class ApiError extends Error {
  constructor(statusCode, message, code = null) {
    super(message);

    this.success = false;

    this.statusCode = statusCode;

    this.code = code;
  }
}

export default ApiError;
