import { Router } from "express";
import { getReports, updateStatus } from "./report.controller.js";
import { validateGetReports, validateUpdateReportStatus } from "../middlewares/report-validator.js";

const router = Router();

router.get("/", validateGetReports, getReports);
router.patch("/status/:reportId", validateUpdateReportStatus, updateStatus);

export default router;