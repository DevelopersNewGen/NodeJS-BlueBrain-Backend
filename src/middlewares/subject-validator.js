import { body, param } from "express-validator";
import { validateField } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";

export const validateGetSubjects = [
    validateJWT,
    handleErrors
];

export const validateGetSubjectById = [
    validateJWT,
    param('id').isMongoId().withMessage('Invalid subject id'),
    validateField,
    handleErrors
];

export const validateCreateSubject = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "TEACHER_ROLE"),
    body('name').notEmpty().withMessage('Subject name is required'),
    body('code').notEmpty().withMessage('Subject code is required'),
    body('grade').notEmpty().withMessage('Subject grade is required'),
    body('description').notEmpty().withMessage('Subject description is required'),
    validateField,
    handleErrors
];

export const validateUpdateSubject = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "TEACHER_ROLE"),
    param('id').isMongoId().withMessage('Invalid subject id'),
    body('name').optional().notEmpty().withMessage('Subject name is required'),
    body('code').optional().notEmpty().withMessage('Subject code is required'),
    body('grade').optional().notEmpty().withMessage('Subject grade is required'),
    body('description').optional().notEmpty().withMessage('Subject description is required'),
    validateField,
    handleErrors
];

export const validateDeleteSubject = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "TEACHER_ROLE"),
    param('id').isMongoId().withMessage('Invalid subject id'),
    validateField,
    handleErrors
];

export const validateAddTeacherToSubject = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "TEACHER_ROLE"),
    param('id').isMongoId().withMessage('Invalid subject id'),
    body('teacherId').isMongoId().withMessage('Invalid teacher id'),
    validateField,
    handleErrors
];


