



import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000", 
  timeout: 10000,
});




api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);




api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {

      localStorage.removeItem("userToken");
      localStorage.removeItem("user"); // Also remove user data
    }
    return Promise.reject(error);
  }
);



export const userSignup = (data) => api.post("/user/signup", data);
export const userSignin = (data) => api.post("/user/signin", data);
export const getUserPurchases = () => api.get("/user/purchases");



export const getCoursesPreview = () => api.get("/courses/preview");
export const purchaseCourse = (courseId) =>
  api.post("/courses/purchase", { courseId });



export const createCourse = (data) => api.post("/admin/course", data);
export const updateCourse = (data) => api.put("/admin/course", data);
export const getAdminCourses = () => api.get("/admin/course/bulk");

export default api;
