import express from "express";
import cors from "cors";
import middleware from "./utils/middleware.js";
import { dataRouter } from "./routes/data.route.js";

const app = express();

const cors_options = {
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

app.use(cors(cors_options));

app.use(express.json());

app.use(middleware.firstMiddleware);

app.get("/test", (req, res) => {
  res.send("Route is working");
});
app.use("/data", dataRouter);

app.use(middleware.errorHandlerMiddleware);

export { app };
