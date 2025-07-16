import { body, param } from "express-validator";
import { validateField } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";

export const validateGetPrivTutorials = [
    validateJWT,
    handleErrors
];

export const validateGetPrivTutorialById = [
    validateJWT,
    param('ptid').isMongoId().withMessage('Invalid tutorial id'),
    validateField,
    handleErrors
];

export const validateCreatePrivTutorial = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "TEACHER_ROLE", "TUTOR_ROLE"),
    body('topic').notEmpty().isString().withMessage('topic is required'),
    validateField,
    handleErrors
];