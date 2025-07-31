import { Router } from "express";
import { getPublicTutorials, getPublicTutorialById, getMyPublicTutorials, getTutorialByStudent } from "./publicTutorial.controller.js";
import { validateGetPrivTutorials, validateGetMyPrivTutorials, validateGetPrivTutorialById, validateGetTutorialByStudent } from "../middlewares/tutorial-validator.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     PublicTutorial:
 *       type: object
 *       required:
 *         - title
 *         - teacher
 *         - subject
 *         - scheduledDate
 *       properties:
 *         _id:
 *           type: string
 *           description: Public tutorial ID
 *         title:
 *           type: string
 *           description: Tutorial title
 *         description:
 *           type: string
 *           description: Tutorial description
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
 *         maxParticipants:
 *           type: number
 *           description: Maximum number of participants
 *         participants:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of participant user IDs
 *         status:
 *           type: string
 *           enum: [scheduled, live, completed, cancelled]
 *           description: Tutorial status
 *         meetingLink:
 *           type: string
 *           description: Video call link
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /BlueBrain/v1/publicTutorials:
 *   post:
 *     tags: [Public Tutorials]
 *     summary: Crear tutoría pública
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Tutoría pública creada exitosamente
 *   get:
 *     tags: [Public Tutorials]
 *     summary: Obtener todas las tutorías públicas
 *     responses:
 *       200:
 *         description: Lista de tutorías públicas obtenida exitosamente
 */

/**
 * @swagger
 * /BlueBrain/v1/publicTutorials/{id}:
 *   get:
 *     tags: [Public Tutorials]
 *     summary: Obtener tutoría pública por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tutoría pública obtenida exitosamente
 *   put:
 *     tags: [Public Tutorials]
 *     summary: Actualizar tutoría pública
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
 *         description: Tutoría pública actualizada exitosamente
 *   delete:
 *     tags: [Public Tutorials]
 *     summary: Eliminar tutoría pública
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
 *         description: Tutoría pública eliminada exitosamente
 */

/**
 * @swagger
 * /BlueBrain/v1/publicTutorials/{id}/join:
 *   post:
 *     tags: [Public Tutorials]
 *     summary: Unirse a tutoría pública
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
 *         description: Unido a la tutoría exitosamente
 */

/**
 * @swagger
 * /BlueBrain/v1/publicTutorials/{id}/leave:
 *   post:
 *     tags: [Public Tutorials]
 *     summary: Salir de tutoría pública
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
 *         description: Salido de la tutoría exitosamente
 */

const router = Router();

router.get("/student/:studentId", validateGetTutorialByStudent, getTutorialByStudent);
router.get("/myTutorials", validateGetMyPrivTutorials, getMyPublicTutorials);
router.get("/:ptid", validateGetPrivTutorialById, getPublicTutorialById);
router.get("/", validateGetPrivTutorials, getPublicTutorials);

export default router;