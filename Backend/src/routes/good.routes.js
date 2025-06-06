import express from "express";
import goodController from "../controllers/good.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// POST ?search=tej, ?status=full, ?type=baked -- FILTER, ?page=1(oldal száma), ?pageSize=3(hány darab tétel van per oldal)
router.post("/", authMiddleware.authenticate, goodController.create);
// GET
router.get("/", authMiddleware.authenticate, goodController.list);
router.get("/:id", authMiddleware.authenticate, goodController.getById);
// PUT
router.put("/:id", authMiddleware.authenticate, goodController.update);
// DELETE
router.delete("/:id", authMiddleware.authenticate, goodController.destroy);
// EXTRA ?search=tej, ?status=full, ?type=baked -- FILTER, ?page=1(oldal száma), ?pageSize=3(hány darab tétel van per oldal)
router.get("/by-household/:householdId", authMiddleware.authenticate, goodController.listByHousehold);

export default router;
