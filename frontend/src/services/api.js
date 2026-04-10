



import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", 
  timeout: 10000,
});




api.interceptors.request.use(
  (config) => {

    const adminToken = localStorage.getItem("adminToken");
    const userToken = localStorage.getItem("userToken");

    if (config.url.startsWith("/admin") && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
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
      localStorage.removeItem("adminToken");
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



export const adminSignup = (data) => api.post("/admin/signup", data);
export const adminSignin = (data) => api.post("/admin/signin", data);
export const createCourse = (data) => api.post("/admin/course", data);
export const updateCourse = (data) => api.put("/admin/course", data);
export const getAdminCourses = () => api.get("/admin/course/bulk");

export default api;
