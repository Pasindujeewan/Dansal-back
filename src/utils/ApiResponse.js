// this is generic response format for all api responses

export default class ApiResponse {
  constructor(success, code, data = null) {
    this.success = success;
    this.code = code;
    this.data = data;
  }
}
