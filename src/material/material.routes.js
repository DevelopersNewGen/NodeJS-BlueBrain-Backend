import { Router } from "express";
import { createMaterial, getMaterials, updateMaterial, deleteMaterial } from "./material.controller.js";
import { validateCreateMaterial, validateUpdateMaterial, validateDeleteMaterial } from "../middlewares/material-validator.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Material:
 *       type: object
 *       required:
 *         - title
 *         - subject
 *         - content
 *         - author
 *       properties:
 *         _id:
 *           type: string
 *           description: Material ID
 *         title:
 *           type: string
 *           description: Material title
 *         subject:
 *           type: string
 *           description: Subject ID
 *         content:
 *           type: string
 *           description: Material content URL
 *         author:
 *           type: string
 *           description: Author user ID
 *         type:
 *           type: string
 *           enum: [pdf, video, image, document]
 *           description: Material type
 *         isActive:
 *           type: boolean
 *           description: Material status
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /BlueBrain/v1/materials:
 *   post:
 *     tags: [Materials]
 *     summary: Subir nuevo material
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Material subido exitosamente
 *   get:
 *     tags: [Materials]
 *     summary: Obtener todos los materiales
 *     responses:
 *       200:
 *         description: Lista de materiales obtenida exitosamente
 */

/**
 * @swagger
 * /BlueBrain/v1/materials/{id}:
 *   get:
 *     tags: [Materials]
 *     summary: Obtener material por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Material obtenido exitosamente
 *   put:
 *     tags: [Materials]
 *     summary: Actualizar material
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
 *         description: Material actualizado exitosamente
 *   delete:
 *     tags: [Materials]
 *     summary: Eliminar material
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
 *         description: Material eliminado exitosamente
 */

const router = Router();

router.post("/create", validateCreateMaterial, createMaterial);
router.get("/", getMaterials);
router.put("/update/:mid", validateUpdateMaterial, updateMaterial);
router.delete("/delete/:mid", validateDeleteMaterial, deleteMaterial);

export default router;