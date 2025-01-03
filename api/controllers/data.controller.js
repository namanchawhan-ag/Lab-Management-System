import { dataService } from "../services/data.service.js";

export const insertData = async (req, res) => {
  const data = await dataService.insertData(req.body);
  res.status(201).json({
    message: "Data inserted successfully",
    data,
  });
};

export const getData = async (req, res) => {
  const data = await dataService.getAllData();
  res.status(200).json({
    message: "Data retrieved successfully",
    data,
  });
};

export const getDashboardStats = async (req, res) => {
  const data = await dataService.getDashboardStats();
  res.json({
    success: true,
    data,
  });
};

export const postDashboardStats = async (req, res) => {
  const data = await dataService.getFilteredDashboardStats(req.body);
  res.json({
    success: true,
    data,
  });
};
