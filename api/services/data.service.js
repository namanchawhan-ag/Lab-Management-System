import { dataDb } from "../db/data.db.js";
import { errorHandler } from "../utils/error.js";

export const dataService = {
  insertData: async (data) => {
    try {
      const {
        lab_name,
        main_food_category,
        parameter,
        limit_standard_specification,
        range_of_testing,
      } = data;

      // if (!lab_name) {
      //   throw errorHandler(400, "Missing required fields");
      // }

      return await dataDb.insert(
        lab_name,
        main_food_category,
        parameter,
        limit_standard_specification,
        range_of_testing
      );
    } catch (error) {
      throw errorHandler(error.statusCode || 500, error.message);
    }
  },

  insertDataBatch: async (dataBatch) => {
    try {
      return await dataDb.insertBatch(
        dataBatch
      );
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
        total_labs: data.totalLabs,
        total_entries: data.totalEntries,
        total_food_categories: data.totalFood,
        total_test_categories: data.totalTest,
        labGroupedEntries: data.labGrouped,
        testGroupedEntries: data.testGrouped,
        crossTabMatrix: data.crossTab,
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
        total_labs: data.totalLabs,
        total_entries: data.totalEntries,
        total_food_categories: data.totalFood,
        total_test_categories: data.totalTest,
        labGroupedEntries: data.labGrouped,
        testGroupedEntries: data.testGrouped,
        crossTabMatrix: data.crossTab,
        categories: data.uniqueCategories,
      };
    } catch (error) {
      throw errorHandler(500, error.message);
    }
  },
};
