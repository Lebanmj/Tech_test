import axios from "axios";

const client = axios.create({
  baseURL: "https://teknorix.jobsoid.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10s safety timeout
});

// Optional: Add interceptors (log errors)
client.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default client;
