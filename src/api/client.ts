import axios from "axios";
// baseurl
export const api = axios.create({
  baseURL: "https://route-posts.routemisr.com/",
});
// auto send token headers on every request + bearer
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.token = token;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// auto logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? "";
    const isAuthCall = url.includes("/users/signin") || url.includes("/users/signup");
    if (error.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);