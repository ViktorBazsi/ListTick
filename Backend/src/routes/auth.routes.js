import express from "express";
import autController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", autController.register);
router.post("/login", autController.login);

export default router;
