import { body, param } from "express-validator";
import { validateField } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";

export const validateGetReports = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "TEACHER_ROLE"),
    handleErrors
];

export const validateUpdateReportStatus = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "TEACHER_ROLE"),
    param('reportId').isMongoId().withMessage('Invalid report id'),
    body('status').isIn(['PENDING', 'RESOLVED', 'REJECTED']).withMessage('Invalid status'),
    validateField,
    handleErrors
];