import { dataDb } from "../db/data.db.js";
import { errorHandler } from "../utils/error.js";

export const dataService = {
  insertData: async (data) => {
    try {
      const { lab_name, main_food_category, test_sub_category } = data;
      
      if (!lab_name || !main_food_category || !test_sub_category) {
        throw errorHandler(400, "Missing required fields");
      }

      return await dataDb.insert(lab_name, main_food_category, test_sub_category);
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
