import { Router } from "express";
import { getSubjects, getSubjectById, createSubject, updateSubject, deleteSubject, addTeacherToSubject, removeTeacherFromSubject } from "./subject.controller.js";
import { validateGetSubjects, validateCreateSubject, validateAddTeacherToSubject, validateDeleteSubject, validateGetSubjectById, validateUpdateSubject } from "../middlewares/subject-validator.js";
import { uploadSubjectImg } from "../middlewares/cloudinary-uploader.js";

const router = Router()

router.get("/", validateGetSubjects, getSubjects )
router.get("/:sid", validateGetSubjectById, getSubjectById)
router.post("/create", uploadSubjectImg.single("img"), validateCreateSubject, createSubject)
router.put("/update/:sid", validateUpdateSubject, updateSubject)
router.delete("/delete/:sid", validateDeleteSubject, deleteSubject)
router.put("/addTeacher/:sid", validateAddTeacherToSubject, addTeacherToSubject)
router.put("/removeTeacher/:sid", validateAddTeacherToSubject, removeTeacherFromSubject) 

export default router;