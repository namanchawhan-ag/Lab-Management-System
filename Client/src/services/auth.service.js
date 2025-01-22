import { toast, useToast } from "@/hooks/use-toast";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3001/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (email, password) => {
  try {
    const res = await apiClient.post(`/login`, {
      email,
      password,
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

export const signup = async (email, password) => {
  try {
    const res = await apiClient.post(`/signup`, {
      email,
      password,
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
