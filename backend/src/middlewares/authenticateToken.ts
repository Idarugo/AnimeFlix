import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = "tu_clave_secreta"; // Debe estar en un entorno seguro

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token no proporcionado" });

  try {
    jwt.verify(token, SECRET_KEY);
    next();
  } catch (error) {
    res.status(403).json({ message: "Token inválido o expirado" });
  }
}
