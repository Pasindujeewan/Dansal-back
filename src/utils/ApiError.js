// this is generic error format for all api errors
import Error from "error";

export default class ApiError extends Error {
  constructor(statusCode, message, errorCode) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.errorCode = errorCode;
  }
}
