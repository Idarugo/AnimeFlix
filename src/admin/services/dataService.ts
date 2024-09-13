// src/services/dataService.ts
import axios from "axios";

interface Anime {
  id: number;
  titulo: string;
  descripcion: string;
  genero: string;
}

interface Launch {
  fecha: string;
  cantidad: number;
}

interface Category {
  id: number;
  nombre: string;
}

interface Serie {
  id: number;
  titulo: string;
  categoria: string;
}

interface Resena {
  id: number;
  comentario: string;
  usuario_nombre: string;
  created_at: string;
}

interface Notificacion {
  id: number;
  tipo: string;
  mensaje: string;
  created_at: string;
}

interface Historial {
  id: number;
  anime_titulo: string;
  usuario_nombre: string;
  fecha_visto: string;
}

interface Clasificacion {
  id: number;
  nombre: string;
  descripcion: string;
}

interface Genero {
  id: number;
  nombre: string;
}

interface Trabajador {
  id: number;
  nombre: string;
  email: string;
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

// Funciones de servicios con tipos definidos
export async function fetchAnimeData(): Promise<Anime[]> {
  const response = await axios.get<Anime[]>("https://localhost:3000/api/animes");
  return response.data;
}

export async function fetchLaunchData(): Promise<Launch[]> {
  const response = await axios.get<Launch[]>("https://localhost:3000/api/lanzamientos");
  return response.data;
}

export async function fetchCategoryData(): Promise<Category[]> {
  const response = await axios.get<Category[]>("https://localhost:3000/api/categorias");
  return response.data;
}

export async function fetchSeriesData(): Promise<Serie[]> {
  const response = await axios.get<Serie[]>("https://localhost:3000/api/series");
  return response.data;
}

export async function fetchResenaData(): Promise<Resena[]> {
  const response = await axios.get<Resena[]>("https://localhost:3000/api/resenas");
  return response.data;
}

export async function fetchNotificacionData(): Promise<Notificacion[]> {
  const response = await axios.get<Notificacion[]>("https://localhost:3000/api/notificaciones");
  return response.data;
}

export async function fetchHistorialData(): Promise<Historial[]> {
  const response = await axios.get<Historial[]>("https://localhost:3000/api/historiales");
  return response.data;
}

export async function fetchClasificacionData(): Promise<Clasificacion[]> {
  const response = await axios.get<Clasificacion[]>("https://localhost:3000/api/clasificacion_edad");
  return response.data;
}

export async function fetchGeneroData(): Promise<Genero[]> {
  const response = await axios.get<Genero[]>("https://localhost:3000/api/generos");
  return response.data;
}

export async function fetchTrabajadorData(): Promise<Trabajador[]> {
  const response = await axios.get<Trabajador[]>("https://localhost:3000/api/trabajadores");
  return response.data;
}

export async function fetchUsuarioData(): Promise<Usuario[]> {
  const response = await axios.get<Usuario[]>("https://localhost:3000/api/usuarios");
  return response.data;
}
