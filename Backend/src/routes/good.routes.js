import express from "express";
import goodController from "../controllers/good.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// POST
router.post("/", authMiddleware.authenticate, goodController.create);
// GET
router.get("/", authMiddleware.authenticate, goodController.list);
router.get("/:id", authMiddleware.authenticate, goodController.getById);
// PUT
router.put("/:id", authMiddleware.authenticate, goodController.update);
// DELETE
router.delete("/:id", authMiddleware.authenticate, goodController.destroy);
// EXTRA
router.get("/by-household/:householdId", authMiddleware.authenticate, goodController.listByHousehold);


export default router;
