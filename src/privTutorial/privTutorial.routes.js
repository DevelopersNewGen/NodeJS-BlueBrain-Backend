import { Router } from "express";
import { getPrivTutorials, getPrivTutorialById } from "./privTutorial.controller.js";
import { validateGetPrivTutorials, validateGetPrivTutorialById } from "../middlewares/tutorial-validator.js";

const router = Router();

router.get("/", validateGetPrivTutorials, getPrivTutorials);
router.get("/:ptid", validateGetPrivTutorialById, getPrivTutorialById);

export default router;