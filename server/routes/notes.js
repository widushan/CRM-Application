import express from "express";
import { addNote } from "../controllers/noteController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const noteRouter = express.Router();

noteRouter.post("/add", authMiddleware, addNote);

export default noteRouter;
