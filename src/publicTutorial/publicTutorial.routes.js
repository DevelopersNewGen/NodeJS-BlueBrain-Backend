import { Router } from "express";
import { getPublicTutorials, getPublicTutorialById, getMyPublicTutorials, getTutorialByStudent } from "./publicTutorial.controller.js";
import { validateGetPrivTutorials, validateGetMyPrivTutorials, validateGetPrivTutorialById, validateGetTutorialByStudent } from "../middlewares/tutorial-validator.js";

const router = Router();

router.get("/student/:studentId", validateGetTutorialByStudent, getTutorialByStudent);
router.get("/myTutorials", validateGetMyPrivTutorials, getMyPublicTutorials);
router.get("/:ptid", validateGetPrivTutorialById, getPublicTutorialById);
router.get("/", validateGetPrivTutorials, getPublicTutorials);

export default router;