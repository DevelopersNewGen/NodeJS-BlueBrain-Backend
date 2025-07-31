import { Router } from "express";
import { getPrivTutorials, getPrivTutorialById, getMyPrivTutorials, acceptPrivTutorial, getTutorialByStudent } from "./privTutorial.controller.js";
import { validateGetPrivTutorials, validateGetMyPrivTutorials, validateGetPrivTutorialById, validateAcceptTutorial, validateGetTutorialByStudent, validateUpdateStatusPrivTutorial } from "../middlewares/tutorial-validator.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     PrivateTutorial:
 *       type: object
 *       required:
 *         - student
 *         - teacher
 *         - subject
 *         - scheduledDate
 *       properties:
 *         _id:
 *           type: string
 *           description: Private tutorial ID
 *         student:
 *           type: string
 *           description: Student user ID
 *         teacher:
 *           type: string
 *           description: Teacher user ID
 *         subject:
 *           type: string
 *           description: Subject ID
 *         scheduledDate:
 *           type: string
 *           format: date-time
 *           description: Scheduled date and time
 *         duration:
 *           type: number
 *           description: Duration in minutes
 *         status:
 *           type: string
 *           enum: [scheduled, in_progress, completed, cancelled]
 *           description: Tutorial status
 *         meetingLink:
 *           type: string
 *           description: Video call link
 *         notes:
 *           type: string
 *           description: Tutorial notes
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /BlueBrain/v1/privTutorials:
 *   post:
 *     tags: [Private Tutorials]
 *     summary: Agendar tutoría privada
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Tutoría privada agendada exitosamente
 *   get:
 *     tags: [Private Tutorials]
 *     summary: Obtener tutorías privadas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tutorías privadas obtenida exitosamente
 */

/**
 * @swagger
 * /BlueBrain/v1/privTutorials/{id}:
 *   get:
 *     tags: [Private Tutorials]
 *     summary: Obtener tutoría privada por ID
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
 *         description: Tutoría privada obtenida exitosamente
 *   put:
 *     tags: [Private Tutorials]
 *     summary: Actualizar tutoría privada
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
 *         description: Tutoría privada actualizada exitosamente
 */

const router = Router();

router.get("/", validateGetPrivTutorials, getPrivTutorials);
router.get("/myTutorials", validateGetMyPrivTutorials, getMyPrivTutorials);
router.get("/get/:ptid", validateGetPrivTutorialById, getPrivTutorialById);
router.patch("/accept/:ptid", validateAcceptTutorial, acceptPrivTutorial);
router.get("/student/:studentId", validateGetTutorialByStudent, getTutorialByStudent);

export default router;