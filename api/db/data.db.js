import pool from "../config/db.js";

export const dataDb = {
  insert: async (lab_name, main_food_category, test_sub_category) => {
    const insertQuery = `
      INSERT INTO lab_data (lab_name, main_food_category, test_sub_category) 
      VALUES ($1, $2, $3) 
      RETURNING *`;
    
    const result = await pool.query(insertQuery, [
      lab_name,
      main_food_category,
      test_sub_category,
    ]);
    return result.rows[0];
  },

  getAll: async () => {
    const query = `SELECT * FROM lab_data`;
    const result = await pool.query(query);
    return result.rows;
  },

  getDashboardStats: async () => {
    const queries = {
      totalCounts: `
        SELECT 
          COUNT(DISTINCT lab_name) as total_labs,
          COUNT(*) as total_entries,
          COUNT(DISTINCT main_food_category) as total_food_categories,
          COUNT(DISTINCT test_sub_category) as total_test_categories
        FROM lab_data
      `,
      labGrouped: `
        SELECT lab_name, COUNT(*) as entry_count
        FROM lab_data
        GROUP BY lab_name
        ORDER BY lab_name
      `,
      testGrouped: `
        SELECT test_sub_category, COUNT(*) as entry_count
        FROM lab_data
        GROUP BY test_sub_category
        ORDER BY test_sub_category
      `,
      crossTab: `
        SELECT 
          lab_name,
          main_food_category,
          COUNT(*) as entry_count
        FROM lab_data
        GROUP BY lab_name, main_food_category
        ORDER BY lab_name, main_food_category
      `,
      uniqueCategories: `
        SELECT 
          ARRAY_AGG(DISTINCT lab_name) AS lab_names,
          ARRAY_AGG(DISTINCT main_food_category) AS food_categories,
          ARRAY_AGG(DISTINCT test_sub_category) AS test_categories
        FROM lab_data
      `
    };

    const [totalCounts, labGrouped, testGrouped, crossTab, uniqueCategories] =
      await Promise.all([
        pool.query(queries.totalCounts),
        pool.query(queries.labGrouped),
        pool.query(queries.testGrouped),
        pool.query(queries.crossTab),
        pool.query(queries.uniqueCategories),
      ]);

    return {
      totalCounts: totalCounts.rows[0],
      labGrouped: labGrouped.rows,
      testGrouped: testGrouped.rows,
      crossTab: crossTab.rows,
      uniqueCategories: uniqueCategories.rows[0]
    };
  },

  getFilteredDashboardStats: async (filters) => {
    const { lab_name, main_food_category, test_sub_category } = filters;

    const whereConditions = [];
    const queryParams = [];
    let paramCounter = 1;

    if (Array.isArray(lab_name) && lab_name.length > 0) {
      whereConditions.push(`lab_name = ANY($${paramCounter})`);
      queryParams.push(lab_name);
      paramCounter++;
    }

    if (Array.isArray(main_food_category) && main_food_category.length > 0) {
      whereConditions.push(`main_food_category = ANY($${paramCounter})`);
      queryParams.push(main_food_category);
      paramCounter++;
    }

    if (Array.isArray(test_sub_category) && test_sub_category.length > 0) {
      whereConditions.push(`test_sub_category = ANY($${paramCounter})`);
      queryParams.push(test_sub_category);
      paramCounter++;
    }

    const whereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(" AND ")}`
      : "";

    const queries = {
      totalCounts: `
        SELECT 
          COUNT(DISTINCT lab_name) as total_labs,
          COUNT(*) as total_entries,
          COUNT(DISTINCT main_food_category) as total_food_categories,
          COUNT(DISTINCT test_sub_category) as total_test_categories
        FROM lab_data
        ${whereClause}
      `,
      labGrouped: `
        SELECT lab_name, COUNT(*) as entry_count
        FROM lab_data
        ${whereClause}
        GROUP BY lab_name
        ORDER BY lab_name
      `,
      testGrouped: `
        SELECT test_sub_category, COUNT(*) as entry_count
        FROM lab_data
        ${whereClause}
        GROUP BY test_sub_category
        ORDER BY test_sub_category
      `,
      crossTab: `
        SELECT 
          lab_name,
          main_food_category,
          COUNT(*) as entry_count
        FROM lab_data
        ${whereClause}
        GROUP BY lab_name, main_food_category
        ORDER BY lab_name, main_food_category
      `,
      uniqueCategories: `
        WITH filtered_labs AS (
          SELECT DISTINCT lab_name
          FROM lab_data
          ${whereClause}
        )
        SELECT 
          (SELECT ARRAY_AGG(DISTINCT lab_name) FROM lab_data) as lab_names,
          (
            SELECT ARRAY_AGG(DISTINCT main_food_category) 
            FROM lab_data 
            WHERE lab_name IN (SELECT lab_name FROM filtered_labs)
          ) as food_categories,
          (
            SELECT ARRAY_AGG(DISTINCT test_sub_category) 
            FROM lab_data 
            WHERE lab_name IN (SELECT lab_name FROM filtered_labs)
          ) as test_categories
      `
    };

    const [totalCounts, labGrouped, testGrouped, crossTab, uniqueCategories] =
      await Promise.all([
        pool.query(queries.totalCounts, queryParams),
        pool.query(queries.labGrouped, queryParams),
        pool.query(queries.testGrouped, queryParams),
        pool.query(queries.crossTab, queryParams),
        pool.query(queries.uniqueCategories, queryParams),
      ]);

    return {
      totalCounts: totalCounts.rows[0],
      labGrouped: labGrouped.rows,
      testGrouped: testGrouped.rows,
      crossTab: crossTab.rows,
      uniqueCategories: uniqueCategories.rows[0]
    };
  }
}; 