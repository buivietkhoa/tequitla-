import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export function getErrorMessage(error) {
  return (
    error?.response?.data?.message || error?.message || "Đã xảy ra lỗi, vui lòng thử lại"
  );
}

export default api;
