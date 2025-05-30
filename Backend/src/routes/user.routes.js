import express from "express";
import userController from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// POST
router.post("/", userController.create);
// GET
router.get("/", authMiddleware.authenticate, userController.list);
router.get("/:id", authMiddleware.authenticate, userController.getById);
// PUT
router.put("/:id", authMiddleware.authenticate, userController.update);
// DELETE
router.delete("/:id", authMiddleware.authenticate, userController.destroy);

export default router;
