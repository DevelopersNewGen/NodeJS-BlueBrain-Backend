import { Router } from "express";
import { 
    getTutorials, 
    getTutorialById, 
    createTutorial, 
    updateTutorial, 
    deleteTutorial, 
    getTutorialsByHost, 
    getTutorialsBySubject, 
    requestTutorial
} from "./tutorial.controller.js";
import { 
    validateGetTutorials,
    validateGetTutorialById,
    validateCreateTutorial,
    validateUpdateTutorial,
    validateDeleteTutorial,
    validateGetTutorialsByHost,
    validateGetTutorialsBySubject,
    validateRequestTutorial
} from "../middlewares/tutorial-validator.js";

const router = Router();

router.get("/", validateGetTutorials, getTutorials);

router.get("/host/:uid", validateGetTutorialsByHost, getTutorialsByHost);

router.get("/subject/:sid", validateGetTutorialsBySubject, getTutorialsBySubject);

router.get("/:tid", validateGetTutorialById, getTutorialById);

router.post("/create", validateCreateTutorial, createTutorial);

router.put("/update/:tid", validateUpdateTutorial, updateTutorial);

router.delete("/delete/:tid", validateDeleteTutorial, deleteTutorial);

router.post("/accept/:tid", validateRequestTutorial, requestTutorial);

export default router;