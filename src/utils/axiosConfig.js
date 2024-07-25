// utils/axiosConfig.js
import axios from "axios";

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export default axiosInstance;
