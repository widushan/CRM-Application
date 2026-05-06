import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/auth.js";
import leadRouter from "./routes/leads.js";
import noteRouter from "./routes/notes.js";
import dashboardRouter from "./routes/dashboard.js";

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// api endpoints
app.use("/api/auth", authRouter);
app.use("/api/leads", leadRouter);
app.use("/api/notes", noteRouter);
app.use("/api/dashboard", dashboardRouter);

app.get("/", (req, res) => {
    res.send(" CRM API Working");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});