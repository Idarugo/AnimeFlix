import { Request, Response } from "express";
import { getAllMembershipPlans, createMembershipPlan } from "../models/membershipPlanModel";

// Controlador para obtener todos los planes de membresía
export async function getMembershipPlansHandler(req: Request, res: Response) {
    try {
        const plans = await getAllMembershipPlans(req.app.get("pool"));
        res.json(plans);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los planes de membresía" });
    }
}


// Controlador para crear un nuevo plan de membresía
export async function createMembershipPlanHandler(req: Request, res: Response) {
    try {
        const result = await createMembershipPlan(req.app.get("pool"), req.body);
        res.status(201).json({ message: "Plan de membresía creado", id: (result as any).insertId });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el plan de membresía" });
    }
}
