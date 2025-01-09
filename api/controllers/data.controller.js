import xlsx from "xlsx";
import { dataService } from "../services/data.service.js";

export const ParseData = async (req, res) => {
  const processedData = processData();

  for (const data of processedData) {
    await dataService.insertData(data);
  }
  res.status(201).json({
    processedData,
  });
};

function processData() {
  const excel_file = "./utils/sheet.xlsx";
  const workbook = xlsx.readFile(excel_file);

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const jsonData = xlsx.utils.sheet_to_json(sheet);

  const processedData = jsonData.map((row) => ({
    lab_name: row["Discipline / Group"],
    main_food_category: row["Materials or Products tested"],
    parameter:
      row[
        "Component, parameter or charcteristic tested / Specific Test Performed / Tests or type of tests Performed"
      ],
    limit_standard_specification:
      row[
        "Test Method Specification against which tests are performed and / or the techiques / equipment used"
      ],
    range_of_testing: row["Range of Testing / Limits of Detection"],
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
