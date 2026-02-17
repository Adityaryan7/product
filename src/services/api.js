// services/api.js - Centralized API service for consistent error handling

const API_BASE = "https://fakestoreapi.com";

class APIService {
  async request(url, options = {}) {
    try {
      const response = await fetch(`${API_BASE}${url}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Auth endpoints
  login(username, password) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  // Products endpoints
  getProducts() {
    return this.request("/products");
  }

  getProduct(id) {
    return this.request(`/products/${id}`);
  }

  getCategories() {
    return this.request("/products/categories");
  }

  getProductsByCategory(category) {
    return this.request(`/products/category/${category}`);
  }

  // Users endpoints
  createUser(userData) {
    return this.request("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }
}

export default new APIService();
