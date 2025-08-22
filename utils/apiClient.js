class ApiClient {
  constructor(request, baseURL = 'https://jsonplaceholder.typicode.com') {
    this.request = request;
    this.baseURL = baseURL;
  }

  // GET request
  async get(endpoint) {
    const response = await this.request.get(`${this.baseURL}${endpoint}`);
    return {
      status: response.status(),
      data: await response.json(),
      headers: response.headers(),
      response
    };
  }

  // POST request
  async post(endpoint, data) {
    const response = await this.request.post(`${this.baseURL}${endpoint}`, {
      data: data
    });
    return {
      status: response.status(),
      data: await response.json(),
      headers: response.headers(),
      response
    };
  }

  // PUT request
  async put(endpoint, data) {
    const response = await this.request.put(`${this.baseURL}${endpoint}`, {
      data: data
    });
    return {
      status: response.status(),
      data: await response.json(),
      headers: response.headers(),
      response
    };
  }

  // PATCH request
  async patch(endpoint, data) {
    const response = await this.request.patch(`${this.baseURL}${endpoint}`, {
      data: data
    });
    return {
      status: response.status(),
      data: await response.json(),
      headers: response.headers(),
      response
    };
  }

  // DELETE request
  async delete(endpoint) {
    const response = await this.request.delete(`${this.baseURL}${endpoint}`);
    return {
      status: response.status(),
      data: response.status() !== 204 ? await response.json() : {},
      headers: response.headers(),
      response
    };
  }
}

module.exports = ApiClient;