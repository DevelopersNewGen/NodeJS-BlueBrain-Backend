import { Router } from "express";
import { createMaterial, getMaterials, updateMaterial, deleteMaterial } from "./material.controller.js";
import { validateCreateMaterial, validateUpdateMaterial, validateDeleteMaterial } from "../middlewares/material-validator.js";

const router = Router();

router.post("/create", validateCreateMaterial, createMaterial);
router.get("/", getMaterials);
router.put("/update/:mid", validateUpdateMaterial, updateMaterial);
router.delete("/delete/:mid", validateDeleteMaterial, deleteMaterial);

export default router;