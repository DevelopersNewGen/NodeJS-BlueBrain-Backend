import { body, param } from "express-validator";
import { validateField } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";

export const validateGetTutorials = [
    validateJWT,
    handleErrors
];

export const validateGetTutorialById = [
    validateJWT,
    param('tid').isMongoId().withMessage('Invalid tutorial id'),
    validateField,
    handleErrors
];

export const validateCreateTutorial = [
    validateJWT,
    hasRoles("TUTOR_ROLE", "TEACHER_ROLE"),
    body('topic').notEmpty().withMessage('Topic is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('startTime').notEmpty().isISO8601().withMessage('Valid start time is required'),
    body('endTime').notEmpty().isISO8601().withMessage('Valid end time is required'),
    body('subject').isMongoId().withMessage('Invalid subject id'),
    body('access').isIn(['PUBLIC', 'PRIVATE']).withMessage('Access must be PUBLIC or PRIVATE'),
    validateField,
    handleErrors
];

export const validateUpdateTutorial = [
    validateJWT,
    hasRoles("TUTOR_ROLE", "TEACHER_ROLE"),
    param('tid').isMongoId().withMessage('Invalid tutorial id'),
    body('topic').optional().notEmpty().withMessage('Topic cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('startTime').optional().isISO8601().withMessage('Valid start time is required'),
    body('endTime').optional().isISO8601().withMessage('Valid end time is required'),
    validateField,
    handleErrors
];

export const validateDeleteTutorial = [
    validateJWT,
    hasRoles("TUTOR_ROLE", "TEACHER_ROLE", "ADMIN_ROLE"),
    param('tid').isMongoId().withMessage('Invalid tutorial id'),
    validateField,
    handleErrors
];

export const validateGetTutorialsByHost = [
    validateJWT,
    param('uid').isMongoId().withMessage('Invalid user id'),
    validateField,
    handleErrors
];

export const validateGetTutorialsBySubject = [
    validateJWT,
    param('sid').isMongoId().withMessage('Invalid subject id'),
    validateField,
    handleErrors
];

export const validateAcceptTutorial = [
    validateJWT,
    hasRoles("TUTOR_ROLE"),
    param('ptid').isMongoId().withMessage('Invalid tutorial id'),
    validateField,
    handleErrors
];

export const validateGetPrivTutorials = [
    validateJWT,
    handleErrors
];

export const validateGetPrivTutorialById = [
    validateJWT,
    hasRoles("TUTOR_ROLE", "TEACHER_ROLE", "ADMIN_ROLE", "STUDENT_ROLE"),
    param('ptid').isMongoId().withMessage('Invalid private tutorial id'),
    validateField,
    handleErrors
];

export const validateCreatePrivTutorial = [
    validateJWT,
    hasRoles("TUTOR_ROLE", "TEACHER_ROLE"),
    body('tutor').isMongoId().withMessage('Invalid tutor id'),
    body('subject').isMongoId().withMessage('Invalid subject id'),
    body('topic').notEmpty().withMessage('Topic is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('scheduledDate').notEmpty().isISO8601().withMessage('Valid scheduled date is required'),
    body('scheduledEndTime').notEmpty().isISO8601().withMessage('Valid scheduled end time is required'),
    body('duration').optional().isInt({ min: 15, max: 180 }).withMessage('Duration must be between 15 and 180 minutes'),
    validateField,
    handleErrors
];

export const validateUpdatePrivTutorialStatus = [
    validateJWT,
    hasRoles("TUTOR_ROLE", "TEACHER_ROLE", "ADMIN_ROLE"),
    param('ptid').isMongoId().withMessage('Invalid private tutorial id'),
    body('newStatus').isIn(['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED']).withMessage('Invalid status'),
    body('date').optional().isISO8601().withMessage('Valid date is required'),
    validateField,
    handleErrors
];

export const validateAcceptPrivTutorial = [
    validateJWT,
    hasRoles("TUTOR_ROLE"),
    param('ptid').isMongoId().withMessage('Invalid private tutorial id'),
    body('scheduledDate').optional().isISO8601().withMessage('Valid scheduled date is required'),
    body('duration').optional().isInt({ min: 15, max: 180 }).withMessage('Duration must be between 15 and 180 minutes'),
    validateField,
    handleErrors
];

export const validateRejectPrivTutorial = [
    validateJWT,
    hasRoles("TUTOR_ROLE"),
    param('ptid').isMongoId().withMessage('Invalid private tutorial id'),
    body('reason').optional().notEmpty().withMessage('Rejection reason cannot be empty'),
    validateField,
    handleErrors
];

export const validateCompletePrivTutorial = [
    validateJWT,
    hasRoles("TUTOR_ROLE", "TEACHER_ROLE"),
    param('ptid').isMongoId().withMessage('Invalid private tutorial id'),
    body('completedDate').optional().isISO8601().withMessage('Valid completed date is required'),
    body('notes').optional().notEmpty().withMessage('Notes cannot be empty'),
    validateField,
    handleErrors
];

export const validateRequestTutorial = [
    validateJWT,
    hasRoles("STUDENT_ROLE", "TUTOR_ROLE"),
    param('tid').isMongoId().withMessage('Invalid tutorial id'),
    body('startTime').notEmpty().isISO8601().withMessage('Valid start time is required'),
    body('endTime').notEmpty().isISO8601().withMessage('Valid end time is required'),
    validateField,
    handleErrors
];

export const validateUpdateStatusPrivTutorial = [
    validateJWT,
    hasRoles("TUTOR_ROLE", "TEACHER_ROLE", "ADMIN_ROLE"),
    param('ptid').isMongoId().withMessage('Invalid private tutorial id'),
    body('newStatus').isIn(['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED']).withMessage('Invalid status'),
    body('date').optional().isISO8601().withMessage('Valid date is required'),
    validateField,
    handleErrors
];

export const validateGetTutorialByStudent = [
    validateJWT,
    param('studentId').isMongoId().withMessage('Invalid student id'),
    validateField,
    handleErrors
];

export const validateGetMyPrivTutorials = [
    validateJWT,
    hasRoles("STUDENT_ROLE", "TUTOR_ROLE", "TEACHER_ROLE"),
    handleErrors
];