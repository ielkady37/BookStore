import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

// Cart API functions
export const cartApi = {
  getCart: () => api.get("/cart"),
  addToCart: (isbn: string, quantity: number = 1) =>
    api.post("/cart", { isbn, quantity }),
  updateQuantity: (isbn: string, quantity: number) =>
    api.patch(`/cart/${isbn}`, { quantity }),
  removeFromCart: (isbn: string) => api.delete(`/cart/${isbn}`),
  clearCart: () => api.delete("/cart"),
};

export const reportApi = {
  getDashboard: () => api.get("/reports/dashboard"),
  getDailySales: (date: string) => api.get(`/reports/daily-sales?date=${date}`),
  getRestockStats: () => api.get("/reports/restock-history"),
};

export default api;
