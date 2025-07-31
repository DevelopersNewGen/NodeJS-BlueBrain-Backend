import { Router } from "express";
import { login, authCallback } from "./auth.controller.js";

const router = Router();

/**
 * @swagger
 * /BlueBrain/v1/auth/login:
 *   get:
 *     tags: [Authentication]
 *     summary: Iniciar sesión con Microsoft
 *     description: Redirige al usuario a la página de autenticación de Microsoft
 *     responses:
 *       302:
 *         description: Redirección a Microsoft OAuth
 */
router.get("/login", login);

/**
 * @swagger
 * /BlueBrain/v1/auth/callback:
 *   get:
 *     tags: [Authentication]
 *     summary: Callback de autenticación
 *     description: Maneja el callback después de la autenticación exitosa
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Código de autorización de Microsoft
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *       400:
 *         description: Error en la autenticación
 */
router.get("/callback", authCallback);

export default router;