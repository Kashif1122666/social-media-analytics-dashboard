import api from "./axios.js";

export const register = async (userData) => {
  const { data } = await api.post("/auth/signup", userData);
  return data;
};

export const login = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

export const googleLogin = async (payload) => {
  // Use your configured api instance instead of raw axios
  const { data } = await api.post("/api/auth/google", payload);
  return data;
};