import { Request, Response } from "express";
import { getAllTrabajadores, createTrabajador, updateTrabajador, deleteTrabajador } from "../models/trabajadorModel";

export async function getTrabajadoresHandler(req: Request, res: Response) {
  try {
    const trabajadores = await getAllTrabajadores(req.app.get("pool"));
    res.json(trabajadores);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los trabajadores" });
  }
}

export async function createTrabajadorHandler(req: Request, res: Response) {
  try {
    const result = await createTrabajador(req.app.get("pool"), req.body);
    res.status(201).json({ message: "Trabajador creado", id: (result as any).insertId });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el trabajador" });
  }
}

export async function updateTrabajadorHandler(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    await updateTrabajador(req.app.get("pool"), id, req.body);
    res.status(200).json({ message: "Trabajador actualizado" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el trabajador" });
  }
}

export async function deleteTrabajadorHandler(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    await deleteTrabajador(req.app.get("pool"), id);
    res.status(200).json({ message: "Trabajador eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el trabajador" });
  }
}
