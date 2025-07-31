import { Router } from "express";
import { 
    getTutorials, 
    getTutorialById, 
    createTutorial, 
    updateTutorial, 
    deleteTutorial, 
    getTutorialsByHost, 
    getTutorialsBySubject, 
    requestTutorial,
    getMyTutorialsTutor
} from "./tutorial.controller.js";
import { 
    validateGetTutorials,
    validateGetTutorialById,
    validateCreateTutorial,
    validateUpdateTutorial,
    validateDeleteTutorial,
    validateGetTutorialsByHost,
    validateGetTutorialsBySubject,
    validateRequestTutorial,
    validateGetMyTutorialsTutor
} from "../middlewares/tutorial-validator.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Tutorial:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - subject
 *         - author
 *       properties:
 *         _id:
 *           type: string
 *           description: Tutorial ID
 *         title:
 *           type: string
 *           description: Tutorial title
 *         content:
 *           type: string
 *           description: Tutorial content or video URL
 *         description:
 *           type: string
 *           description: Tutorial description
 *         subject:
 *           type: string
 *           description: Subject ID
 *         author:
 *           type: string
 *           description: Author user ID
 *         type:
 *           type: string
 *           enum: [video, written, interactive]
 *           description: Tutorial type
 *         difficulty:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           description: Tutorial difficulty level
 *         duration:
 *           type: number
 *           description: Duration in minutes
 *         views:
 *           type: number
 *           description: Number of views
 *         rating:
 *           type: number
 *           description: Average rating
 *         isActive:
 *           type: boolean
 *           description: Tutorial status
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /BlueBrain/v1/tutorials:
 *   post:
 *     tags: [Tutorials]
 *     summary: Crear nuevo tutorial
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Tutorial creado exitosamente
 *   get:
 *     tags: [Tutorials]
 *     summary: Obtener todos los tutoriales
 *     responses:
 *       200:
 *         description: Lista de tutoriales obtenida exitosamente
 */

/**
 * @swagger
 * /BlueBrain/v1/tutorials/{id}:
 *   get:
 *     tags: [Tutorials]
 *     summary: Obtener tutorial por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tutorial obtenido exitosamente
 *   put:
 *     tags: [Tutorials]
 *     summary: Actualizar tutorial
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
 *         description: Tutorial actualizado exitosamente
 *   delete:
 *     tags: [Tutorials]
 *     summary: Eliminar tutorial
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
 *         description: Tutorial eliminado exitosamente
 */

/**
 * @swagger
 * /BlueBrain/v1/tutorials/{id}/rate:
 *   post:
 *     tags: [Tutorials]
 *     summary: Calificar tutorial
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
 *         description: Tutorial calificado exitosamente
 */

const router = Router();

router.get("/", validateGetTutorials, getTutorials);

router.get("/host/:uid", validateGetTutorialsByHost, getTutorialsByHost);

router.get("/subject/:sid", validateGetTutorialsBySubject, getTutorialsBySubject);

router.get("/myTutorials", validateGetMyTutorialsTutor, getMyTutorialsTutor);

router.get("/:tid", validateGetTutorialById, getTutorialById);

router.post("/create", validateCreateTutorial, createTutorial);

router.put("/update/:tid", validateUpdateTutorial, updateTutorial);

router.delete("/delete/:tid", validateDeleteTutorial, deleteTutorial);

router.post("/accept/:tid", validateRequestTutorial, requestTutorial);

export default router;