import { body, param } from "express-validator";
import { validateField } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";

export const validateCreateMaterial = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "TEACHER_ROLE"),
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('subject').isMongoId().withMessage('Invalid subject id'),
    body('grade').isIn(['4to', '5to', '6to']).withMessage('Invalid grade'),
    body('fileUrl').isURL().withMessage('Valid fileUrl is required'),
    validateField,
    handleErrors
];

export const validateUpdateMaterial = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "TEACHER_ROLE"),
    param('mid').isMongoId().withMessage('Invalid material id'),
    body('title').optional().notEmpty(),
    body('description').optional().notEmpty(),
    body('subject').optional().isMongoId(),
    body('grade').optional().isIn(['4to', '5to', '6to']),
    body('fileUrl').optional().isURL(),
    validateField,
    handleErrors
];

export const validateDeleteMaterial = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "TEACHER_ROLE"),
    param('mid').isMongoId().withMessage('Invalid material id'),
    validateField,
    handleErrors
];