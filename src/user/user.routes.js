import { Router } from "express";
import { getUsers, getUserById, updateProfilePictureAdmin, updateProfilePicture, getSubjectUsers, reportUser, getUserRoleById } from "./user.controller.js";
import { validateGetUsers, validateGetUserById, validateUpdateProfilePictureAdmin, validateUpdateProfilePicture, validateGetSubjectUsers, 
    validateReportUser } from "../middlewares/user-validator.js";
import { uploadUserImg } from "../middlewares/cloudinary-uploader.js";

const router = Router();

router.get("/", validateGetUsers, getUsers);
router.get("/:id", validateGetUserById, getUserById);
router.patch("/updateProfilePictureAdmin/:id", uploadUserImg.single("img"), validateUpdateProfilePictureAdmin, updateProfilePictureAdmin);
router.patch("/updateProfilePicture", uploadUserImg.single("img"), validateUpdateProfilePicture, updateProfilePicture);
router.get("/subject/:subjectId", validateGetSubjectUsers, getSubjectUsers);
router.post("/report", validateReportUser, reportUser);
router.get("/role/:id", getUserRoleById);

export default router;