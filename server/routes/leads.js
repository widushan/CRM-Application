import express from "express";
import { addLead, listLeads, getLeadDetail, updateLead, deleteLead } from "../controllers/leadController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const leadRouter = express.Router();

leadRouter.post("/add", authMiddleware, addLead);
leadRouter.get("/list", authMiddleware, listLeads);
leadRouter.get("/detail/:leadId", authMiddleware, getLeadDetail);
leadRouter.post("/update", authMiddleware, updateLead);
leadRouter.post("/delete", authMiddleware, deleteLead);

export default leadRouter;
