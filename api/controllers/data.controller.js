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
      test_sub_category
    ]);

    res.status(201).json({
      message: "Data inserted successfully",
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(error.statusCode || 500).json({ 
      error: error.message || "Internal server error" 
    });
  }
};

export const getData = async (req, res) => {
  try {
    const query = `SELECT * FROM lab_data`;
    const result = await pool.query(query);
    
    res.status(200).json({
      message: "Data retrieved successfully",
      data: result.rows
    });
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
