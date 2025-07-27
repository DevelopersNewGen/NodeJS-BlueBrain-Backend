import { Router } from "express";
import { login, authCallback } from "./auth.controller.js";

const router = Router();

router.get("/login", login);

router.get("/callback", authCallback);


export default router;