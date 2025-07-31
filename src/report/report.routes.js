import { Router } from "express";
import { getReports, updateStatus } from "./report.controller.js";
import { validateGetReports, validateUpdateReportStatus } from "../middlewares/report-validator.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Report:
 *       type: object
 *       required:
 *         - reporter
 *         - reported
 *         - reason
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *           description: Report ID
 *         reporter:
 *           type: string
 *           description: User ID who reported
 *         reported:
 *           type: string
 *           description: User ID being reported
 *         reason:
 *           type: string
 *           enum: [harassment, spam, inappropriate_content, other]
 *           description: Report reason
 *         description:
 *           type: string
 *           description: Detailed description
 *         status:
 *           type: string
 *           enum: [pending, reviewed, resolved]
 *           description: Report status
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /BlueBrain/v1/reports:
 *   post:
 *     tags: [Reports]
 *     summary: Crear nuevo reporte
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Reporte creado exitosamente
 *   get:
 *     tags: [Reports]
 *     summary: Obtener todos los reportes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reportes obtenida exitosamente
 */

/**
 * @swagger
 * /BlueBrain/v1/reports/{id}:
 *   get:
 *     tags: [Reports]
 *     summary: Obtener reporte por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reporte obtenido exitosamente
 *   patch:
 *     tags: [Reports]
 *     summary: Actualizar estado del reporte
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reporte actualizado exitosamente
 */

const router = Router();

router.get("/", validateGetReports, getReports);
router.patch("/status/:reportId", validateUpdateReportStatus, updateStatus);

export default router;