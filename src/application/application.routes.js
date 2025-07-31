import Router from 'express';
import { requestToBeTutor, getAllApplications, getApplicationsByUser, getApplicationsBySubject, getApplicationById, 
    updateApplicationStatus } from './application.controller.js';
import { peticionToBeTutorValidator, getAllApplicationsValidator, getApplicationsByUserValidator, getApplicationsBySubjectValidator, getApplicationByIdValidator,
    approveApplicationValidator } from '../middlewares/application-validator.js';
import { uploadEvidence } from '../middlewares/cloudinary-uploader.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Application:
 *       type: object
 *       required:
 *         - user
 *         - subject
 *         - evidence
 *       properties:
 *         _id:
 *           type: string
 *           description: Application ID
 *         user:
 *           type: string
 *           description: User ID requesting to be tutor
 *         subject:
 *           type: string
 *           description: Subject ID for tutoring
 *         evidence:
 *           type: string
 *           description: Evidence file URL
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           description: Application status
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ApplicationRequest:
 *       type: object
 *       required:
 *         - user
 *         - subject
 *       properties:
 *         user:
 *           type: string
 *           description: User ID requesting to be tutor
 *         subject:
 *           type: string
 *           description: Subject ID for tutoring
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /BlueBrain/v1/applications/requestTutor:
 *   post:
 *     summary: Request to become a tutor
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - subject
 *               - evidence
 *             properties:
 *               user:
 *                 type: string
 *                 description: User ID requesting to be tutor
 *               subject:
 *                 type: string
 *                 description: Subject ID for tutoring
 *               evidence:
 *                 type: string
 *                 format: binary
 *                 description: Evidence file (image/document)
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /BlueBrain/v1/applications:
 *   get:
 *     summary: Get all applications
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of applications per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filter by application status
 *     responses:
 *       200:
 *         description: List of applications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Application'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /BlueBrain/v1/applications/user/{uid}:
 *   get:
 *     summary: Get applications by user ID
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User applications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Application'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /BlueBrain/v1/applications/subject/{sid}:
 *   get:
 *     summary: Get applications by subject ID
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sid
 *         required: true
 *         schema:
 *           type: string
 *         description: Subject ID
 *     responses:
 *       200:
 *         description: Subject applications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Application'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /BlueBrain/v1/applications/{aid}:
 *   get:
 *     summary: Get application by ID
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Application'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /BlueBrain/v1/applications/approve/{aid}:
 *   patch:
 *     summary: Update application status (approve/reject)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *                 description: New application status
 *               comments:
 *                 type: string
 *                 description: Optional comments for the decision
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: Bad request - invalid status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error
 */

const router = Router();

router.post('/requestTutor', uploadEvidence.single("evidence"), peticionToBeTutorValidator, requestToBeTutor);

router.get('/', getAllApplicationsValidator, getAllApplications);

router.get('/user/:uid', getApplicationsByUserValidator, getApplicationsByUser);

router.get('/subject/:sid', getApplicationsBySubjectValidator, getApplicationsBySubject);

router.get('/:aid', getApplicationByIdValidator, getApplicationById);

router.patch('/approve/:aid', approveApplicationValidator, updateApplicationStatus);

export default router;