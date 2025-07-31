import { Router } from "express";
import { getSubjects, getSubjectById, createSubject, updateSubject, deleteSubject, addTeacherToSubject, removeTeacherFromSubject, removeTutorFromSubject } from "./subject.controller.js";
import { validateGetSubjects, validateCreateSubject, validateAddTeacherToSubject, validateDeleteSubject, validateGetSubjectById, validateUpdateSubject, validateRemoveTutorFromSubject } from "../middlewares/subject-validator.js";
import { uploadSubjectImg } from "../middlewares/cloudinary-uploader.js";

const router = Router()

/**
 * @swagger
 * /BlueBrain/v1/subjects:
 *   get:
 *     tags: [Subjects]
 *     summary: Obtener todas las materias
 *     responses:
 *       200:
 *         description: Lista de materias obtenida exitosamente
 *   post:
 *     tags: [Subjects]
 *     summary: Crear nueva materia
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Materia creada exitosamente
 */

/**
 * @swagger
 * /BlueBrain/v1/subjects/{sid}:
 *   get:
 *     tags: [Subjects]
 *     summary: Obtener materia por ID
 *     parameters:
 *       - in: path
 *         name: sid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Materia obtenida exitosamente
 */

/**
 * @swagger
 * /BlueBrain/v1/subjects/create:
 *   post:
 *     tags: [Subjects]
 *     summary: Crear materia con imagen
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Materia creada exitosamente
 */

/**
 * @swagger
 * /BlueBrain/v1/subjects/update/{sid}:
 *   put:
 *     tags: [Subjects]
 *     summary: Actualizar materia
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Materia actualizada exitosamente
 */

/**
 * @swagger
 * /BlueBrain/v1/subjects/delete/{sid}:
 *   delete:
 *     tags: [Subjects]
 *     summary: Eliminar materia
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Materia eliminada exitosamente
 */

/**
 * @swagger
 * /BlueBrain/v1/subjects/addTeacher/{sid}:
 *   put:
 *     tags: [Subjects]
 *     summary: Agregar profesor a materia
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profesor agregado exitosamente
 */

/**
 * @swagger
 * /BlueBrain/v1/subjects/removeTeacher/{sid}:
 *   put:
 *     tags: [Subjects]
 *     summary: Remover profesor de materia
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profesor removido exitosamente
 */

/**
 * @swagger
 * /BlueBrain/v1/subjects/removeTutor/{sid}:
 *   put:
 *     tags: [Subjects]
 *     summary: Remover tutor de materia
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tutor removido exitosamente
 */

router.get("/", validateGetSubjects, getSubjects )
router.get("/:sid", validateGetSubjectById, getSubjectById)
router.post("/create", uploadSubjectImg.single("img"), validateCreateSubject, createSubject)
router.put("/update/:sid", validateUpdateSubject, updateSubject)
router.delete("/delete/:sid", validateDeleteSubject, deleteSubject)
router.put("/addTeacher/:sid", validateAddTeacherToSubject, addTeacherToSubject)
router.put("/removeTeacher/:sid", validateAddTeacherToSubject, removeTeacherFromSubject) 
router.put("/removeTutor/:sid", validateRemoveTutorFromSubject, removeTutorFromSubject)

export default router;