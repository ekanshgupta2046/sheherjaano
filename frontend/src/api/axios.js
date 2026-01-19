import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

// 🔐 module-level variable (NOT React state)
let accessToken = null;

// setter exposed to React
export const setAccessToken = (token) => {
  accessToken = token;
};

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const refreshAccessToken = async () => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
    {},
    { withCredentials: true }
  );

  const newAccessToken = response.data.accessToken;
  setAccessToken(newAccessToken);
  return newAccessToken;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🚫 DO NOT retry refresh endpoint
    if (originalRequest?.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        setAccessToken(null);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
