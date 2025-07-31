import { Router } from "express";
import { getUsers, getUserById, updateProfilePictureAdmin, updateProfilePicture, getSubjectUsers, reportUser, getUserRoleById } from "./user.controller.js";
import { validateGetUsers, validateGetUserById, validateUpdateProfilePictureAdmin, validateUpdateProfilePicture, validateGetSubjectUsers, 
    validateReportUser } from "../middlewares/user-validator.js";
import { uploadUserImg } from "../middlewares/cloudinary-uploader.js";

const router = Router();

/**
 * @swagger
 * /BlueBrain/v1/users:
 *   get:
 *     tags: [Users]
 *     summary: Obtener todos los usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 */

/**
 * @swagger
 * /BlueBrain/v1/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Obtener usuario por ID
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
 *         description: Usuario obtenido exitosamente
 *   put:
 *     tags: [Users]
 *     summary: Actualizar usuario
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
 *         description: Usuario actualizado exitosamente
 *   delete:
 *     tags: [Users]
 *     summary: Eliminar usuario
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
 *         description: Usuario eliminado exitosamente
 */

router.get("/", validateGetUsers, getUsers);
router.get("/:id", validateGetUserById, getUserById);
router.patch("/updateProfilePictureAdmin/:id", uploadUserImg.single("img"), validateUpdateProfilePictureAdmin, updateProfilePictureAdmin);
router.patch("/updateProfilePicture", uploadUserImg.single("img"), validateUpdateProfilePicture, updateProfilePicture);
router.get("/subject/:subjectId", validateGetSubjectUsers, getSubjectUsers);
router.post("/report", validateReportUser, reportUser);
router.get("/role/:id", getUserRoleById);

export default router;