class ApiResponse {
  constructor(statusCode, data = null, message = "Success", token = null) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.token = token;
  }
}

export default ApiResponse;
