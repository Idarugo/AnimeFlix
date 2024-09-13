import { Request, Response } from "express";
import { getUsuarioByEmail, updateUsuario, storePasswordResetToken, getUserByResetToken } from "../models/usuarioModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendPasswordResetEmail } from "../services/emailService";

const SECRET_KEY = process.env.SECRET_KEY || "tu_clave_secreta"; // Asegúrate de que la clave esté en un entorno seguro

// Manejador de inicio de sesión
export async function loginHandler(req: Request, res: Response) {
  try {
    const { email, password, rememberMe } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Por favor ingrese ambos, correo electrónico y contraseña" });
    }

    const user = await getUsuarioByEmail(req.app.get("pool"), email);

    if (!user) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    const expiresIn = rememberMe ? "7d" : "1h";
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn });

    res.json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
}

// Manejador de obtención de perfil
export async function getPerfilHandler(req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const decoded: any = jwt.verify(token, SECRET_KEY);
    const user = await getUsuarioByEmail(req.app.get("pool"), decoded.email);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el perfil del usuario" });
  }
}

// Manejador de recuperación de contraseña
export async function forgotPasswordHandler(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const pool = req.app.get("pool");

    const user = await getUsuarioByEmail(pool, email);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

    await storePasswordResetToken(pool, user.id, token); // Almacenar el token en la base de datos

    await sendPasswordResetEmail(user.email, token);

    res.json({ message: "Enlace de recuperación enviado a tu correo" });
  } catch (error) {
    console.error("Error al enviar el enlace de recuperación:", error);
    res.status(500).json({ error: "Error al enviar el enlace de recuperación" });
  }
}


// Manejador de restablecimiento de contraseña
export async function resetPasswordHandler(req: Request, res: Response) {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token y nueva contraseña son requeridos" });
    }

    const pool = req.app.get("pool");
    const user = await getUserByResetToken(pool, token);

    if (!user) {
      return res.status(400).json({ error: "Token no válido o expirado" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUsuario(pool, user.id, { password: hashedPassword, reset_token: null, reset_token_expires: null });

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    res.status(500).json({ error: "Error al restablecer la contraseña" });
  }
}
