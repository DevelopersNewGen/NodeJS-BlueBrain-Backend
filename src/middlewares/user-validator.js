import { body, param } from "express-validator";
import { validateField } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";

export const validateGetUsers = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "TEACHER_ROLE"),
    handleErrors
];

export const validateGetUserById = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "TEACHER_ROLE"),
    param('id').isMongoId().withMessage('Invalid user id'),
    validateField,
    handleErrors
];

export const validateUpdateProfilePictureAdmin = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param('id').isMongoId().withMessage('Invalid user id'),
    validateField,
    handleErrors
];

export const validateUpdateProfilePicture = [
    validateJWT,
    handleErrors
];

export const validateGetSubjectUsers = [
    validateJWT,
    param('subjectId').isMongoId().withMessage('Invalid subject id'),
    validateField,
    handleErrors
];

export const validateReportUser = [
    validateJWT,
    body('reportTo').isMongoId().withMessage('Invalid user id to report'),
    body('reason').notEmpty().withMessage('Reason is required'),
    body('relatedSubject').optional().isMongoId().withMessage('Invalid subject id'),
    body('details').optional().isString(),
    validateField,
    handleErrors
];
