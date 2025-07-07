import {body, param} from 'express-validator';
import {validateField} from "./validate-fields.js";
import {handleErrors} from "./handle-errors.js";
import {validateJWT} from "./validate-jwt.js";
import {hasRoles} from "./validate-roles.js";

export const peticionToBeTutorValidator = [
    validateJWT,
    hasRoles("STUDENT_ROLE"),
    body('subject').isMongoId().withMessage('Invalid subject id'),
    body('description').notEmpty().withMessage('description is required'),
    body('evidence').notEmpty().withMessage('Evidence is required'),
    body('evidence.url').isURL().withMessage('Evidence URL must be a valid URL'),
    validateField,
    handleErrors
];

export const getAllApplicationsValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "TEACHER_ROLE", "STUDENT_ROLE"),
    handleErrors
];

export const approveApplicationValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "TEACHER_ROLE", "STUDENT_ROLE"),
    param('aid').isMongoId().withMessage('Invalid application id'),
    body('status').isIn(['approved', 'rejected']).withMessage('Status must be either approved or rejected'),
    body('responseMessage').optional().isString().withMessage('Response message must be a string'),
    validateField,
    handleErrors
];