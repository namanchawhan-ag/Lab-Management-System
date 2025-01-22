import pool from "../config/db.js";

export const dataDb = {
  insert: async (
    lab_name,
    main_food_category,
    parameter,
    limit_standard_specification,
    range_of_testing
  ) => {
    const custom_lab_name = "Chemical Agriculatural Products";
    const custom_test_sub_category = "Regulators";
    const insertQuery = `
      INSERT INTO lab_data (lab_name, main_food_category, parameter, limit_standard_specification, range_of_testing, test_sub_category) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`;
    const result = await pool.query(insertQuery, [
      custom_lab_name,
      main_food_category,
      parameter,
      limit_standard_specification,
      range_of_testing,
      custom_test_sub_category,
    ]);
    return result.rows[0];
  },

  insertBatch: async (dataBatch) => {
    try {
      const custom_lab_name = "Geochem Laboratories Private Limited";

      const insertQuery = `
        INSERT INTO lab_data (
          lab_name,
          main_food_category,
          sub_category,
          product,
          test_category,
          test_sub_category,
          parameter
        )
        VALUES ${dataBatch
          .map(
            (_, i) =>
              `($1, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6}, $${i * 6 + 7})`
          )
          .join(", ")}
        RETURNING *`;

      const values = [
        custom_lab_name,
        ...dataBatch.flatMap(({
          main_food_category,
          sub_category,
          product,
          test_category,
          test_sub_category,
          parameter
        }) => [
          main_food_category,
          sub_category,
          product,
          test_category,
          test_sub_category,
          parameter
        ])
      ];

      const result = await pool.query(insertQuery, values);
      return result.rows;
    } catch (error) {
      console.error("Error in batch insert:", error);
      throw error;
    }
  },

  getAll: async () => {
    const query = `SELECT * FROM lab_data`;
    const result = await pool.query(query);
    return result.rows;
  },

  getDashboardStats: async () => {
    const queries = {
      mainQuery: `
      WITH lab_grouped_data AS (
        SELECT 
          lab_name, 
          COUNT(*) AS entry_count
        FROM lab_data
        GROUP BY lab_name
      ),
      test_grouped_data AS (
        SELECT 
          test_sub_category, 
          COUNT(*) AS entry_count
        FROM lab_data
        GROUP BY test_sub_category
      )
      SELECT 
        (SELECT COUNT(DISTINCT lab_name) FROM lab_data) AS total_labs,
        (SELECT COUNT(*) FROM lab_data) AS total_entries,
        (SELECT COUNT(DISTINCT main_food_category) FROM lab_data) AS total_food_categories,
        (SELECT COUNT(DISTINCT test_sub_category) FROM lab_data) AS total_test_categories,
        (SELECT json_agg(json_build_object('name', lab_name, 'entry_count', entry_count)) FROM lab_grouped_data) AS lab_grouped,
        (SELECT json_agg(json_build_object('name', test_sub_category, 'entry_count', entry_count)) FROM test_grouped_data) AS test_grouped;
      `,
      crossTab: `
      SELECT 
        lab_name,
        json_agg(json_build_object('category', main_food_category,'entry_count', entry_count)) AS main_food_category 
      FROM ( 
        SELECT lab_name,
          main_food_category,
          COUNT(*) AS entry_count 
        FROM lab_data 
        GROUP BY lab_name, 
          main_food_category 
        ORDER BY lab_name, 
          main_food_category 
      ) AS grouped_data 
      GROUP BY lab_name 
      ORDER BY lab_name;
      `,
      uniqueCategories: `
        SELECT 
          ARRAY_AGG(DISTINCT lab_name) AS lab_names,
          ARRAY_AGG(DISTINCT main_food_category) AS food_categories,
          ARRAY_AGG(DISTINCT test_sub_category) AS test_categories
        FROM lab_data
      `,
    };

    const [mainQuery, crossTab, uniqueCategories] = await Promise.all([
      pool.query(queries.mainQuery),
      pool.query(queries.crossTab),
      pool.query(queries.uniqueCategories),
    ]);

    return {
      totalLabs: mainQuery.rows[0].total_labs,
      totalEntries: mainQuery.rows[0].total_entries,
      totalFood: mainQuery.rows[0].total_food_categories,
      totalTest: mainQuery.rows[0].total_test_categories,
      labGrouped: mainQuery.rows[0].lab_grouped,
      testGrouped: mainQuery.rows[0].test_grouped,
      crossTab: crossTab.rows,
      uniqueCategories: uniqueCategories.rows[0],
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

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const queries = {
      mainQuery: `
      WITH lab_grouped_data AS (
        SELECT 
          lab_name, 
          COUNT(*) AS entry_count
        FROM lab_data
        ${whereClause}
        GROUP BY lab_name
      ),
      test_grouped_data AS (
        SELECT 
          test_sub_category, 
          COUNT(*) AS entry_count
        FROM lab_data
        ${whereClause}
        GROUP BY test_sub_category
      )
      SELECT 
        (SELECT COUNT(DISTINCT lab_name) FROM lab_data ${whereClause}) AS total_labs,
        (SELECT COUNT(*) FROM lab_data ${whereClause}) AS total_entries,
        (SELECT COUNT(DISTINCT main_food_category) FROM lab_data ${whereClause}) AS total_food_categories,
        (SELECT COUNT(DISTINCT test_sub_category) FROM lab_data ${whereClause}) AS total_test_categories,
        (SELECT json_agg(json_build_object('name', lab_name, 'entry_count', entry_count)) FROM lab_grouped_data) AS lab_grouped,
        (SELECT json_agg(json_build_object('name', test_sub_category, 'entry_count', entry_count)) FROM test_grouped_data) AS test_grouped;
      `,
      crossTab: `
        SELECT 
        lab_name,
        json_agg(json_build_object('category', main_food_category,'entry_count', entry_count)) AS main_food_category 
      FROM ( 
        SELECT lab_name,
          main_food_category,
          COUNT(*) AS entry_count 
        FROM lab_data 
        ${whereClause}
        GROUP BY lab_name, 
          main_food_category 
        ORDER BY lab_name, 
          main_food_category 
      ) AS grouped_data 
      GROUP BY lab_name 
      ORDER BY lab_name;
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
      `,
    };

    const [mainQuery, crossTab, uniqueCategories] = await Promise.all([
      pool.query(queries.mainQuery, queryParams),
      pool.query(queries.crossTab, queryParams),
      pool.query(queries.uniqueCategories, queryParams),
    ]);

    return {
      totalLabs: mainQuery.rows[0].total_labs,
      totalEntries: mainQuery.rows[0].total_entries,
      totalFood: mainQuery.rows[0].total_food_categories,
      totalTest: mainQuery.rows[0].total_test_categories,
      labGrouped: mainQuery.rows[0].lab_grouped,
      testGrouped: mainQuery.rows[0].test_grouped,
      crossTab: crossTab.rows,
      uniqueCategories: uniqueCategories.rows[0],
    };
  },
};
