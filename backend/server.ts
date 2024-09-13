import express from 'express';
import cors from 'cors'; 
import https from 'https';  // Importa https para configurar el servidor HTTPS
import fs from 'fs';  // Para leer los certificados
import path from 'path'; 
import routes from './src/routes/index'; 
import pool from './src/db';

// Leer los archivos del certificado SSL generados por mkcert
const privateKey = fs.readFileSync('./localhost-key.pem', 'utf8');
const certificate = fs.readFileSync('./localhost.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();

// Middleware
app.use(express.json());

// Habilitar CORS para permitir solicitudes desde el frontend en localhost:5173
app.use(cors({
  origin: ['http://localhost:5173', 'https://localhost:5173'], // Permite HTTP y HTTPS
  credentials: true  // Habilitar el envío de cookies y headers de autenticación si los usas
}));

// Servir la carpeta 'uploads' de manera estática
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// Configurar el pool en la aplicación
app.set("pool", pool);

// Rutas API
app.use('/api', routes);

// Crear un servidor HTTPS
const httpsServer = https.createServer(credentials, app);

// Puerto
const port = process.env.PORT || 3000;

httpsServer.listen(port, () => {
  console.log(`Servidor API corriendo en el puerto ${port} con HTTPS`);
});

export { app, pool };
