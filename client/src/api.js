import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // Required for cookie-based authentication
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
