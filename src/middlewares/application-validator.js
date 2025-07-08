import { body, param } from 'express-validator';
import { validateField } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { deleteFileOnError } from "./delete-file-on-error.js";

export const peticionToBeTutorValidator = [
    validateJWT,
    hasRoles("STUDENT_ROLE", "TUTOR_ROLE"),
    body('subject').isMongoId().withMessage('Invalid subject id'),
    body('description').notEmpty().withMessage('description is required'),
    validateField,
    deleteFileOnError,
    handleErrors
];

export const getAllApplicationsValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "TEACHER_ROLE"),
    handleErrors
];

export const getApplicationsByUserValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "TEACHER_ROLE", "STUDENT_ROLE"),
    param('uid').isMongoId().withMessage('Invalid user id'),
    validateField,
    handleErrors
];

export const getApplicationsBySubjectValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "TEACHER_ROLE"),
    param('sid').isMongoId().withMessage('Invalid subject id'),
    validateField,
    handleErrors
];

export const getApplicationByIdValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "TEACHER_ROLE", "STUDENT_ROLE"),
    param('aid').isMongoId().withMessage('Invalid application id'),
    validateField,
    handleErrors
];

export const approveApplicationValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "TEACHER_ROLE"),
    param('aid').isMongoId().withMessage('Invalid application id'),
    body('status').isIn(['approved', 'rejected']).withMessage('Status must be either approved or rejected'),
    body('responseMessage').optional().isString().withMessage('Response message must be a string'),
    validateField,
    handleErrors
];