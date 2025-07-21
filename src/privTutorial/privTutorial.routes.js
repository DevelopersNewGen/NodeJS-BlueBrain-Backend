import { Router } from "express";
import { getPrivTutorials, getPrivTutorialById, getMyPrivTutorials, acceptPrivTutorial, updateStatusPrivTutorial, getTutorialByStudent } from "./privTutorial.controller.js";
import { validateGetPrivTutorials, validateGetMyPrivTutorials, validateGetPrivTutorialById, validateAcceptTutorial, validateGetTutorialByStudent, validateUpdateStatusPrivTutorial } from "../middlewares/tutorial-validator.js";

const router = Router();

router.get("/", validateGetPrivTutorials, getPrivTutorials);
router.get("/:ptid", validateGetPrivTutorialById, getPrivTutorialById);
router.patch("/accept/:ptid", validateAcceptTutorial, acceptPrivTutorial);
router.get("/student/:studentId", validateGetTutorialByStudent, getTutorialByStudent);
router.patch("/status/:ptid", validateUpdateStatusPrivTutorial, updateStatusPrivTutorial);
router.get("/myTutorials", validateGetMyPrivTutorials, getMyPrivTutorials);

export default router;