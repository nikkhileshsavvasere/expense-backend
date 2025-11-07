import { Router } from "express";
import { generateReportData } from "../controllers/reports.js";
const reportRoute = Router();

reportRoute.post("/", (req, res) => {
    generateReportData(req, res);
});

export default reportRoute;
