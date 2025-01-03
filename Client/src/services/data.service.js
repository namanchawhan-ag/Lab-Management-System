import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3001/data",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getLabData = async () => {
  const res = await apiClient.get(`/getDashboardStats`);
  return res.data.data;
};

export const postLabData = async (filters = {}) => {
  const res = await apiClient.post(`/postDashboardStats`, {
    lab_name: filters.lab_name || [],
    main_food_category: filters.main_food_category || [],
    test_sub_category: filters.test_sub_category || [],
  });
  return res.data.data;
};
