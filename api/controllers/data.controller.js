import pool from "../db/db.js";
import { errorHandler } from "../utils/error.js";

export const insertData = async (req, res) => {
  try {
    const { lab_name, main_food_category, test_sub_category } = req.body;

    if (!lab_name || !main_food_category || !test_sub_category) {
      throw errorHandler(400, "Missing required fields");
    }

    const insertQuery = `
      INSERT INTO lab_data (lab_name, main_food_category, test_sub_category) 
      VALUES ($1, $2, $3) 
      RETURNING *`;

    const result = await pool.query(insertQuery, [
      lab_name,
      main_food_category,
      test_sub_category,
    ]);

    res.status(201).json({
      message: "Data inserted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(error.statusCode || 500).json({
      error: error.message || "Internal server error",
    });
  }
};

export const getData = async (req, res) => {
  try {
    const query = `SELECT * FROM lab_data`;
    const result = await pool.query(query);

    res.status(200).json({
      message: "Data retrieved successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const { lab_name, main_food_category, test_sub_category } = req.body;

    const labNamesArray = lab_name || null;
    const foodCategoriesArray = main_food_category || null;
    const testCategoriesArray = test_sub_category || null;

    const queries = {
      totalCounts: `
        SELECT 
          CASE 
            WHEN $1::text[] IS NOT NULL THEN array_length($1::text[], 1)
            ELSE COUNT(DISTINCT lab_name)
          END as total_labs,
          COUNT(*) as total_entries,
          COUNT(DISTINCT main_food_category) as total_food_categories,
          COUNT(DISTINCT test_sub_category) as total_test_categories
        FROM lab_data
        WHERE ($1::text[] IS NULL OR lab_name = ANY($1))
          AND ($2::text[] IS NULL OR main_food_category = ANY($2))
          AND ($3::text[] IS NULL OR test_sub_category = ANY($3))
      `,

      labGrouped: `
        SELECT lab_name, COUNT(*) as entry_count
        FROM lab_data
        WHERE ($1::text[] IS NULL OR lab_name = ANY($1))
          AND ($2::text[] IS NULL OR main_food_category = ANY($2))
          AND ($3::text[] IS NULL OR test_sub_category = ANY($3))
        GROUP BY lab_name
        ORDER BY lab_name
      `,

      testGrouped: `
        SELECT test_sub_category, COUNT(*) as entry_count
        FROM lab_data
        WHERE ($1::text[] IS NULL OR lab_name = ANY($1))
          AND ($2::text[] IS NULL OR main_food_category = ANY($2))
          AND ($3::text[] IS NULL OR test_sub_category = ANY($3))
        GROUP BY test_sub_category
        ORDER BY test_sub_category
      `,

      crossTab: `
        SELECT 
          lab_name,
          main_food_category,
          COUNT(*) as entry_count
        FROM lab_data
        WHERE ($1::text[] IS NULL OR lab_name = ANY($1))
          AND ($2::text[] IS NULL OR main_food_category = ANY($2))
          AND ($3::text[] IS NULL OR test_sub_category = ANY($3))
        GROUP BY lab_name, main_food_category
        ORDER BY lab_name, main_food_category
      `,

      uniqueCategories: `
        WITH filtered_labs AS (
          SELECT DISTINCT lab_name
          FROM lab_data
          WHERE ($1::text[] IS NULL OR lab_name = ANY($1))
            AND ($2::text[] IS NULL OR main_food_category = ANY($2))
            AND ($3::text[] IS NULL OR test_sub_category = ANY($3))
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

    const [totalCounts, labGrouped, testGrouped, crossTab, uniqueCategories] =
      await Promise.all([
        pool.query(queries.totalCounts, [
          labNamesArray,
          foodCategoriesArray,
          testCategoriesArray,
        ]),
        pool.query(queries.labGrouped, [
          labNamesArray,
          foodCategoriesArray,
          testCategoriesArray,
        ]),
        pool.query(queries.testGrouped, [
          labNamesArray,
          foodCategoriesArray,
          testCategoriesArray,
        ]),
        pool.query(queries.crossTab, [
          labNamesArray,
          foodCategoriesArray,
          testCategoriesArray,
        ]),
        pool.query(queries.uniqueCategories, [
          labNamesArray,
          foodCategoriesArray,
          testCategoriesArray,
        ]),
      ]);

    const crossTabMatrix = crossTab.rows.reduce((acc, row) => {
      if (!acc[row.lab_name]) {
        acc[row.lab_name] = {};
      }
      acc[row.lab_name][row.main_food_category] = row.entry_count;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        ...totalCounts.rows[0],
        labGroupedEntries: labGrouped.rows,
        testGroupedEntries: testGrouped.rows,
        crossTabMatrix,
        categories: uniqueCategories.rows[0],
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

export const postDashboardStats = async (req, res) => {
  try {
    const { lab_name, main_food_category, test_sub_category } = req.body;

    const labNamesArray = lab_name || null;
    const foodCategoriesArray = main_food_category || null;
    const testCategoriesArray = test_sub_category || null;

    const queries = {
      totalCounts: `
        SELECT 
          CASE 
            WHEN $1::text[] IS NOT NULL THEN array_length($1::text[], 1)
            ELSE COUNT(DISTINCT lab_name)
          END as total_labs,
          COUNT(*) as total_entries,
          COUNT(DISTINCT main_food_category) as total_food_categories,
          COUNT(DISTINCT test_sub_category) as total_test_categories
        FROM lab_data
        WHERE ($1::text[] IS NULL OR lab_name = ANY($1))
          AND ($2::text[] IS NULL OR main_food_category = ANY($2))
          AND ($3::text[] IS NULL OR test_sub_category = ANY($3))
      `,

      labGrouped: `
        SELECT lab_name, COUNT(*) as entry_count
        FROM lab_data
        WHERE ($1::text[] IS NULL OR lab_name = ANY($1))
          AND ($2::text[] IS NULL OR main_food_category = ANY($2))
          AND ($3::text[] IS NULL OR test_sub_category = ANY($3))
        GROUP BY lab_name
        ORDER BY lab_name
      `,

      testGrouped: `
        SELECT test_sub_category, COUNT(*) as entry_count
        FROM lab_data
        WHERE ($1::text[] IS NULL OR lab_name = ANY($1))
          AND ($2::text[] IS NULL OR main_food_category = ANY($2))
          AND ($3::text[] IS NULL OR test_sub_category = ANY($3))
        GROUP BY test_sub_category
        ORDER BY test_sub_category
      `,

      crossTab: `
        SELECT 
          lab_name,
          main_food_category,
          COUNT(*) as entry_count
        FROM lab_data
        WHERE ($1::text[] IS NULL OR lab_name = ANY($1))
          AND ($2::text[] IS NULL OR main_food_category = ANY($2))
          AND ($3::text[] IS NULL OR test_sub_category = ANY($3))
        GROUP BY lab_name, main_food_category
        ORDER BY lab_name, main_food_category
      `,

      uniqueCategories: `
        WITH filtered_labs AS (
          SELECT DISTINCT lab_name
          FROM lab_data
          WHERE ($1::text[] IS NULL OR lab_name = ANY($1))
            AND ($2::text[] IS NULL OR main_food_category = ANY($2))
            AND ($3::text[] IS NULL OR test_sub_category = ANY($3))
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

    const [totalCounts, labGrouped, testGrouped, crossTab, uniqueCategories] =
      await Promise.all([
        pool.query(queries.totalCounts, [
          labNamesArray,
          foodCategoriesArray,
          testCategoriesArray,
        ]),
        pool.query(queries.labGrouped, [
          labNamesArray,
          foodCategoriesArray,
          testCategoriesArray,
        ]),
        pool.query(queries.testGrouped, [
          labNamesArray,
          foodCategoriesArray,
          testCategoriesArray,
        ]),
        pool.query(queries.crossTab, [
          labNamesArray,
          foodCategoriesArray,
          testCategoriesArray,
        ]),
        pool.query(queries.uniqueCategories, [
          labNamesArray,
          foodCategoriesArray,
          testCategoriesArray,
        ]),
      ]);

    const crossTabMatrix = crossTab.rows.reduce((acc, row) => {
      if (!acc[row.lab_name]) {
        acc[row.lab_name] = {};
      }
      acc[row.lab_name][row.main_food_category] = row.entry_count;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        ...totalCounts.rows[0],
        labGroupedEntries: labGrouped.rows,
        testGroupedEntries: testGrouped.rows,
        crossTabMatrix,
        categories: uniqueCategories.rows[0],
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};
