// src/services/api.js
// Central Axios instance for all API calls.
// Automatically attaches JWT token from localStorage to every request header.

import axios from "axios";

// Create Axios instance pointing to the backend
const api = axios.create({
  baseURL: "http://localhost:3000", // Backend URL
  timeout: 10000,
});

// ─────────────────────────────────────────────
// Request Interceptor
// Runs before every request — adds Bearer token if available
// ─────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Check which token to use based on the URL path
    const adminToken = localStorage.getItem("adminToken");
    const userToken = localStorage.getItem("userToken");

    // Admin routes get admin token; everything else gets user token
    if (config.url.startsWith("/admin") && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────
// Response Interceptor
// Handles global errors (e.g., 401 Unauthorized → redirect to login)
// ─────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired or invalid — clear storage
      localStorage.removeItem("userToken");
      localStorage.removeItem("adminToken");
    }
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────
// API Functions — User
// ─────────────────────────────────────────────
export const userSignup = (data) => api.post("/user/signup", data);
export const userSignin = (data) => api.post("/user/signin", data);
export const getUserPurchases = () => api.get("/user/purchases");

// ─────────────────────────────────────────────
// API Functions — Courses (Public)
// ─────────────────────────────────────────────
export const getCoursesPreview = () => api.get("/courses/preview");
export const purchaseCourse = (courseId) =>
  api.post("/courses/purchase", { courseId });

// ─────────────────────────────────────────────
// API Functions — Admin
// ─────────────────────────────────────────────
export const adminSignup = (data) => api.post("/admin/signup", data);
export const adminSignin = (data) => api.post("/admin/signin", data);
export const createCourse = (data) => api.post("/admin/course", data);
export const updateCourse = (data) => api.put("/admin/course", data);
export const getAdminCourses = () => api.get("/admin/course/bulk");

export default api;
