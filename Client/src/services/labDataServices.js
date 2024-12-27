import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3001/data",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getLabData = async () => {
  const res = await apiClient.get(`/all`);
  return res.data.data;
};
