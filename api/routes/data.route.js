import express from "express";
import { insertData, getData } from "../controllers/data.controller.js";

const router = express.Router();

router.post("/insert", insertData);
router.get("/all", getData);

export { router as dataRouter };
