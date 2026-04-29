import axios from "axios";

/**
 * Shared Axios instance for same-origin API routes.
 */
export const httpClient = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15_000,
});
