import express from "express";
import { insertData, getData, getDashboardStats, postDashboardStats, ParseData } from "../controllers/data.controller.js";
import middleware from "../utils/middleware.js";

const router = express.Router();

router.post("/insert", insertData);
router.get("/all", getData);
router.get("/getDashboardStats", getDashboardStats);
router.post("/postDashboardStats", middleware.cleanEmptyArrays, postDashboardStats);
router.get("/parseData", ParseData);

export { router as dataRouter };
