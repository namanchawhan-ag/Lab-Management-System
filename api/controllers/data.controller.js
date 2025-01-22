import xlsx from "xlsx";
import { dataService } from "../services/data.service.js";

export const ParseData = async (req, res) => {
  const processedData = processData();
  const batchSize = 100;

  for (let i = 0; i < processedData.length; i += batchSize) {
    const batch = processedData.slice(i, i + batchSize);
    await dataService.insertDataBatch(batch);
  }

  res.status(201).json({
    totalInserted: processedData.length,
  });
};

function processData() {
  const excel_file = "./utils/sheet.xlsx";
  const workbook = xlsx.readFile(excel_file);

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const jsonData = xlsx.utils.sheet_to_json(sheet);

  const processedData = jsonData.map((row) => ({
    main_food_category: row["Main Food Category "],
    sub_category: row["Sub-category"],
    product: row["Product"],
    test_category: row["Test category"],
    test_sub_category: row["Test Sub category"],
    parameter: row["Parameter"],
  }));

  return processedData;
}

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
