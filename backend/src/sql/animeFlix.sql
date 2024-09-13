-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_id INT,
    password VARCHAR(255) NOT NULL,
    preferencias JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (avatar_id) REFERENCES avatares(id) ON DELETE SET NULL -- Agregar ON DELETE SET NULL para manejar eliminaciones de avatares
);


-- Tabla de trabajadores (admins y moderadores)
CREATE TABLE trabajadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'moderador') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE contacto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de géneros
CREATE TABLE generos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

-- Tabla de clasificación por edad
CREATE TABLE clasificacion_edad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT
);

-- Tabla de animes
CREATE TABLE animes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    imagen_url VARCHAR(255),
    clasificacion_edad_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (clasificacion_edad_id) REFERENCES clasificacion_edad(id) ON DELETE SET NULL
);

-- Relación muchos a muchos entre animes y géneros
CREATE TABLE anime_generos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    anime_id INT NOT NULL,
    genero_id INT NOT NULL,
    FOREIGN KEY (anime_id) REFERENCES animes(id) ON DELETE CASCADE,
    FOREIGN KEY (genero_id) REFERENCES generos(id) ON DELETE CASCADE
);

-- Tabla de categorías
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

-- Relación muchos a muchos entre animes y categorías
CREATE TABLE anime_categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    anime_id INT NOT NULL,
    categoria_id INT NOT NULL,
    FOREIGN KEY (anime_id) REFERENCES animes(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
);

-- Tabla de series
CREATE TABLE series (
    id INT AUTO_INCREMENT PRIMARY KEY,
    anime_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    FOREIGN KEY (anime_id) REFERENCES animes(id) ON DELETE CASCADE
);

-- Tabla de temporadas
CREATE TABLE temporadas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    serie_id INT NOT NULL,
    numero_temporada INT NOT NULL,
    titulo VARCHAR(255),
    descripcion TEXT,
    imagen_url VARCHAR(255),
    FOREIGN KEY (serie_id) REFERENCES series(id) ON DELETE CASCADE
);

-- Tabla de episodios
CREATE TABLE episodios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    temporada_id INT NOT NULL,
    numero_episodio INT NOT NULL,
    titulo VARCHAR(255),
    descripcion TEXT,
    video_url VARCHAR(255),
    duracion TIME,
    FOREIGN KEY (temporada_id) REFERENCES temporadas(id) ON DELETE CASCADE
);

-- Tabla de reseñas
CREATE TABLE resenas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    anime_id INT NOT NULL,
    user_id INT NOT NULL,
    calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (anime_id) REFERENCES animes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de lanzamientos
CREATE TABLE lanzamientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    episodio_id INT NOT NULL,
    fecha_lanzamiento DATE NOT NULL,
    FOREIGN KEY (episodio_id) REFERENCES episodios(id) ON DELETE CASCADE
);

-- Tabla de listas de usuarios (mi lista de animes)
CREATE TABLE listas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    anime_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (anime_id) REFERENCES animes(id) ON DELETE CASCADE
);

-- Tabla de historial de visualización
CREATE TABLE historial (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    anime_id INT NOT NULL,
    fecha_visto DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (anime_id) REFERENCES animes(id) ON DELETE CASCADE
);

-- Tabla de notificaciones
CREATE TABLE notificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tipo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE avatar_categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);


CREATE TABLE avatares (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    categoria_id INT,
    FOREIGN KEY (categoria_id) REFERENCES avatar_categorias(id) ON DELETE SET NULL
);

-- Tabla de planes de membresía
CREATE TABLE planes_membresia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    duracion_en_meses INT NOT NULL -- Duración del plan en meses
);

CREATE TABLE metodos_pago (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL -- Ejemplo: "Tarjeta", "PayPal", etc.
);

CREATE TABLE suscripciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  plan_id INT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_proximo_pago DATE NOT NULL,
  metodo_pago_id INT NOT NULL, -- Referencia a la tabla metodos_pago
  tarjeta_ultimos4 VARCHAR(4), -- Últimos 4 dígitos de la tarjeta (opcional si el método de pago es "Tarjeta")
  fecha_expiracion VARCHAR(5);
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES planes_membresia(id) ON DELETE CASCADE,
  FOREIGN KEY (metodo_pago_id) REFERENCES metodos_pago(id) ON DELETE RESTRICT -- Evita eliminar si hay referencias
);



INSERT INTO planes_membresia (nombre, descripcion, precio, duracion_en_meses) VALUES
('Plan Básico', 'Acceso a contenido limitado en una sola pantalla', 6990.00, 1),
('Plan Estándar', 'Acceso a contenido en dos pantallas simultáneamente', 9990.00, 1),
('Plan Premium', 'Acceso a contenido en cuatro pantallas simultáneamente con calidad 4K', 12990.00, 1);

INSERT INTO metodos_pago (nombre) VALUES ('Tarjeta'), ('PayPal'), ('Transferencia Bancaria');


INSERT INTO avatar_categorias (nombre) VALUES
('One Piece'),
('Hunter x Hunter'),
('Jujutsu Kaisen'),
('Kimetsu no Yaiba');

INSERT INTO avatares (nombre, url, categoria_id) VALUES
('Luffy', '/uploads/avatares/luffy.png', 1),
('Zoro', '/uploads/avatares/zoro.png', 1),
('Gon', '/uploads/avatares/gon.png', 2),
('Killua', '/uploads/avatares/killua.png', 2),
('Itadori', '/uploads/avatares/itadori.png', 3),
('Gojo', '/uploads/avatares/gojo.png', 3),
('Tanjiro', '/uploads/avatares/tanjiro.png', 4),
('Nezuko', '/uploads/avatares/nezuko.png', 4);


-- Inserciones de prueba
INSERT INTO trabajadores (nombre, email, password, rol) VALUES 
('Admin 1', 'admin1@animeflix.com', 'password123', 'admin');

-- Insertar un usuario de prueba
INSERT INTO usuarios (nombre, email, avatar_id, password, preferencias) VALUES 
('Usuario 1', 'usuario1@animeflix.com',1,'$2b$10$GlTcRLP2onzQI2E1HHBusukIp/y9YMaJ2iwvNVpl11ndHqLWg3Fb6', NULL);



-- Ejemplo de inserción de un mensaje de contacto
INSERT INTO contacto (nombre, email, mensaje) VALUES 
('Usuario de Prueba', 'prueba@example.com', 'Este es un mensaje de prueba.');


INSERT INTO generos (nombre) VALUES 
('Acción'), 
('Aventura'), 
('Comedia'), 
('Ciencia Ficción'),
('Drama'), 
('Psicológica'), 
('Fantasía Medieval'), 
('Romance'), 
('Terror');

INSERT INTO categorias (nombre) VALUES 
('Series'), 
('Películas'), 
('Novedades populares');


-- Insertar clasificaciones de edad
INSERT INTO clasificacion_edad (nombre, descripcion)
VALUES
('TODOS', 'Recomendada para todos los públicos'),
('7+', 'Recomendada para niños a partir de los 7 años'),
('10+', 'Recomendada para niños a partir de los 10 años'),
('13+', 'Recomendada para niños a partir de los 13 años'),
('16+', 'Recomendada para jóvenes a partir de los 16 años'),
('18+', 'Recomendada para jóvenes a partir de los 18 años');

INSERT INTO animes (titulo, descripcion, clasificacion_edad_id) VALUES 
('Mashle', 'Este es un mundo de magia. Este es un mundo en el que todos usan la magia habitualmente. En un bosque profundo y oscuro de este mundo de magia, hay un chico que se ejercita a diario. Su nombre es Mash Burnedead y tiene un secreto: no puede usar magia. Lo único que quería era vivir tranquilo con su familia, pero cuando un día intentan matarlo por no poder usar magia, las cosas se salen de control y acaba inscrito en una escuela mágica, donde su objetivo será convertirse en el \"Iluminado Divino\", el alumno más formidable, el elegido de Dios. ¿Podrán sus poderosos músculos derrotar a los más brillantes usuarios de magia? ¡Se alza el telón de esta historia de magia y fantasía peculiar en el que la fuerza puede con la magia!', '/uploads/animes/mashle.png', 1);

INSERT INTO anime_categorias (anime_id, categoria_id) VALUES 
(1, 1), -- Naruto - Acción
(1, 2); -- Naruto - Aventura

INSERT INTO series (anime_id, titulo, descripcion) VALUES 
(1, 'Naruto: Shippuden', 'Continúa la historia de Naruto...');

INSERT INTO temporadas (serie_id, numero_temporada, titulo, descripcion) VALUES 
(1, 1, 'Primera Temporada', 'La primera temporada de Naruto: Shippuden...');

INSERT INTO episodios (temporada_id, numero_episodio, titulo, descripcion, video_url, duracion) VALUES 
(1, 1, 'Episodio 1', 'El regreso de Naruto...', 'https://mega.io/ejemplo1', '00:24:00');

-- Insertar una reseña
INSERT INTO resenas (anime_id, user_id, calificacion, comentario) VALUES 
(1, 1, 5, 'Excelente anime!');


INSERT INTO lanzamientos (episodio_id, fecha_lanzamiento) VALUES 
(1, '2024-09-01');

INSERT INTO resenas (anime_id, user_id, calificacion, comentario) VALUES 
(1, 1, 5, 'Excelente anime!');


ALTER TABLE usuarios ADD COLUMN reset_token VARCHAR(255);
ALTER TABLE usuarios ADD COLUMN reset_token_expires DATETIME;
