import express from "express";
import householdController from "../controllers/household.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// POST
router.post("/", authMiddleware.authenticate, householdController.create);
// GET
router.get(
  "/my",
  authMiddleware.authenticate,
  householdController.getMyHouseholds
);
router.get("/", authMiddleware.authenticate, householdController.list);
router.get("/:id", authMiddleware.authenticate, householdController.getById);
// PUT
router.put("/:id", authMiddleware.authenticate, householdController.update);
// DELETE
router.delete("/:id", authMiddleware.authenticate, householdController.destroy);
// EXTRÁK
router.put("/:id/join", authMiddleware.authenticate, householdController.join);
router.put(
  "/:id/leave",
  authMiddleware.authenticate,
  householdController.leave
);

export default router;
