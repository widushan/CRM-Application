import express from "express";
import { getStats } from "../controllers/dashboardController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/stats", authMiddleware, getStats);

export default dashboardRouter;
