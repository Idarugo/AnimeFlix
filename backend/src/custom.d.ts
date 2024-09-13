import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload | string; // Asegúrate de que `JwtPayload` o el tipo que utilizas sea correcto.
  }
}
