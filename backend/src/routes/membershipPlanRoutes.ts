import { Router } from "express";
import { getMembershipPlansHandler, createMembershipPlanHandler } from "../controllers/membershipPlanController";

const router = Router();

// Rutas para planes de membresía
router.get("/", getMembershipPlansHandler);
router.post("/", createMembershipPlanHandler);

export default router;
