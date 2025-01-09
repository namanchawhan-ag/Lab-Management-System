import { dataDb } from "../db/data.db.js";
import { errorHandler } from "../utils/error.js";

export const dataService = {
  insertData: async (data) => {
    try {
      console.log(data);
      
      const { lab_name, main_food_category, parameter, limit_standard_specification, range_of_testing } = data;
      
      // if (!lab_name) {
      //   throw errorHandler(400, "Missing required fields");
      // }

      return await dataDb.insert(lab_name, main_food_category, parameter, limit_standard_specification, range_of_testing);
    } catch (error) {
      throw errorHandler(error.statusCode || 500, error.message);
    }
  },

  getAllData: async () => {
    try {
      return await dataDb.getAll();
    } catch (error) {
      throw errorHandler(500, error.message);
    }
  },

  getDashboardStats: async () => {
    try {
      const data = await dataDb.getDashboardStats();
      return {
        ...data.totalCounts,
        labGroupedEntries: data.labGrouped,
        testGroupedEntries: data.testGrouped,
        crossTabMatrix: createCrossTabMatrix(data.crossTab),
        categories: data.uniqueCategories,
      };
    } catch (error) {
      throw errorHandler(500, error.message);
    }
  },

  getFilteredDashboardStats: async (filters) => {
    try {
      const data = await dataDb.getFilteredDashboardStats(filters);
      return {
        ...data.totalCounts,
        labGroupedEntries: data.labGrouped,
        testGroupedEntries: data.testGrouped,
        crossTabMatrix: createCrossTabMatrix(data.crossTab),
        categories: data.uniqueCategories,
      };
    } catch (error) {
      throw errorHandler(500, error.message);
    }
  }
};

const createCrossTabMatrix = (crossTabRows) => {
  return crossTabRows.reduce((acc, row) => {
    if (!acc[row.lab_name]) {
      acc[row.lab_name] = {};
    }
    acc[row.lab_name][row.main_food_category] = row.entry_count;
    return acc;
  }, {});
};
