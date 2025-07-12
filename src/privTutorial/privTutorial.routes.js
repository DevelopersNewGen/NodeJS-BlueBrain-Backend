import { Router } from "express";
import { getPrivTutorials, getPrivTutorialById, createPrivTutorial } from "./privTutorial.controller.js";
import { validateGetPrivTutorials, validateGetPrivTutorialById, validateCreatePrivTutorial } from "../middlewares/tutorial-validator.js";

const router = Router();

router.get("/", validateGetPrivTutorials, getPrivTutorials);
router.get("/:ptid", validateGetPrivTutorialById, getPrivTutorialById);
router.post("/priv", validateCreatePrivTutorial, createPrivTutorial);

export default router;