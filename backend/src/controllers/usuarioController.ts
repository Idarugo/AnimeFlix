import { Request, Response } from "express";
import { getAllUsuarios, createUsuario, updateUsuario, deleteUsuario, getUsuarioByEmail, getUsuarioWithAvatarById } from "../models/usuarioModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = "tu_clave_secreta"; // Debe estar en un entorno seguro

export async function getUsuariosHandler(req: Request, res: Response) {
  try {
    const usuarios = await getAllUsuarios(req.app.get("pool"));
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
}

export async function createUsuarioHandler(req: Request, res: Response) {
  try {
    // Encriptar la contraseña antes de guardar el usuario
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const result = await createUsuario(req.app.get("pool"), { ...req.body, password: hashedPassword });
    res.status(201).json({ message: "Usuario creado", id: (result as any).insertId });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el usuario" });
  }
}

export async function updateUsuarioHandler(req: Request, res: Response) {
  try {
    console.log("Datos recibidos en el backend:", req.body);

    const { nombre, email, password, avatar_id } = req.body;

    const usuarioData: {
      nombre?: string;
      email?: string;
      avatar_id?: number;
      password?: string;
    } = {};

    if (nombre) usuarioData.nombre = nombre;
    if (email) usuarioData.email = email;
    if (avatar_id) usuarioData.avatar_id = avatar_id;  // Manejar avatar_id
    if (password) {
      usuarioData.password = await bcrypt.hash(password, 10);
    }

    // Llamada a la función updateUsuario
    const result = await updateUsuario(req.app.get("pool"), parseInt(req.params.id, 10), usuarioData);

    // Verificar si alguna fila fue afectada
    console.log('Filas afectadas:', result.affectedRows);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No se encontró el usuario para actualizar" });
    }

    res.status(200).json({ message: "Usuario actualizado" });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error en updateUsuarioHandler:', error.message);
      res.status(500).json({ error: "Error al actualizar el usuario", details: error.message });
    } else {
      console.error('Error desconocido en updateUsuarioHandler:', error);
      res.status(500).json({ error: "Error al actualizar el usuario" });
    }
  }
}

export async function deleteUsuarioHandler(req: Request, res: Response) {
  try {
    await deleteUsuario(req.app.get("pool"), parseInt(req.params.id, 10));
    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
}

export async function loginUsuarioHandler(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await getUsuarioByEmail(req.app.get("pool"), email);
    if (!user) {
      return res.status(401).json({ message: "Correo electrónico o contraseña incorrectos" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Correo electrónico o contraseña incorrectos" });
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
}

export async function getPerfilUsuarioHandler(req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const decoded: any = jwt.verify(token, SECRET_KEY);
    const user = await getUsuarioByEmail(req.app.get("pool"), decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // No devolver la contraseña al frontend
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el perfil del usuario" });
  }
}

export async function getUsuarioWithAvatarHandler(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await getUsuarioWithAvatarById(req.app.get("pool"), userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el usuario con avatar" });
  }
}