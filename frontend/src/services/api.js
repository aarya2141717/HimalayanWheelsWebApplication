import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  getSecurityQuestion: (data) => api.post("/auth/security-question", data),
  verifySecurity: (data) => api.post("/auth/verify-security", data),
  resetPassword: (data) => api.post("/auth/reset-password", data),
};

export const vehicleAPI = {
  getAllVehicles: () => api.get("/vehicles"),
  getMyVehicles: () => api.get("/vehicles/my-vehicles"),
  addVehicle: (formData) => api.post("/vehicles", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  updateVehicle: (id, formData) => api.put(`/vehicles/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  deleteVehicle: (id) => api.delete(`/vehicles/${id}`),
  toggleAvailability: (id) => api.patch(`/vehicles/${id}/toggle-availability`),
};

export const bookingAPI = {
  createBooking: (data) => api.post("/bookings", data),
  getCustomerBookings: () => api.get("/bookings/customer"),
  getProviderBookings: () => api.get("/bookings/provider"),
  getAllBookings: () => api.get("/bookings/all"),
  getBookingStats: () => api.get("/bookings/stats"),
  updateBooking: (id, data) => api.put(`/bookings/${id}`, data),
  updateBookingStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
};

export default api;
