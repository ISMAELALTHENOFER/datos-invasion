# Datos de Consolidación

> **Centros Cristianos Cielos Abiertos** — Sistema interno de registro y consulta de datos de consolidación.

Aplicación web para gestionar el registro de personas en el proceso de consolidación. Permite cargar datos de personas con información de mentor, invasor, datos de contacto y preferencias, así como buscar y visualizar todos los registros.

---

## Tecnologías

| Capa        | Tecnología                                  |
|-------------|---------------------------------------------|
| Backend     | Node.js + Express                           |
| Frontend    | HTML + Tailwind CSS (CDN) + Vanilla JS      |
| Base de datos | MySQL 8.0 (Docker)                        |
| Conexión DB | `mysql2` con pool de conexiones             |

## Requisitos

- **Node.js** >= 18
- **MySQL** 8.0 (o Docker con imagen `mysql:8.0`)
- **npm**

## Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd datos-invasion

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con los datos de tu base de datos
```

## Configuración

Crear un archivo `.env` en la raíz del proyecto:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=datos_invasion
PORT=3000
```

> **Importante:** El archivo `.env` contiene credenciales sensibles y **no debe versionarse** (ya está en `.gitignore`).

## Base de Datos

Ejecutar el siguiente script para crear la tabla:

```sql
CREATE TABLE personas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mentor VARCHAR(255) NOT NULL,
  invasor VARCHAR(255) NOT NULL,
  nombre_completo VARCHAR(255) NOT NULL,
  celular VARCHAR(50),
  barrio VARCHAR(255),
  peticiones TEXT,
  quiere_visita BOOLEAN DEFAULT FALSE,
  se_congrega_iglesia BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Uso

```bash
# Iniciar servidor de producción
npm start

# Iniciar con reinicio automático (desarrollo)
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Funcionalidades

### Formulario de carga
- Selección de mentor (lista predefinida)
- Nombre del invasor
- Datos de la persona: nombre completo, celular, barrio, peticiones
- Indicadores: ¿Quiere visita? / ¿Se congrega en una iglesia?
- Validación de teléfono (7–15 dígitos)
- Diseño responsive (mobile-first)

### Listado con buscador
- Visualización de todas las personas registradas en formato de tarjetas
- Badges de color para "Quiere visita" (verde) y "Se congrega en iglesia" (ámbar)
- Búsqueda en tiempo real por nombre, barrio, mentor, invasor y "quiere visita"
- Mínimo 3 caracteres para activar la búsqueda

## API REST

| Método | Ruta                 | Descripción                     |
|--------|----------------------|---------------------------------|
| `GET`  | `/health`            | Health check del servidor       |
| `GET`  | `/api/personas`      | Lista todas las personas        |
| `GET`  | `/api/personas?q=`   | Busca personas (≥ 3 caracteres) |
| `POST` | `/api/personas`      | Crea una nueva persona          |

### Ejemplo de creación

```json
{
  "mentor": "Ariel",
  "invasor": "Juan Pérez",
  "nombre_completo": "María López",
  "celular": "11 2345 6789",
  "barrio": "Centro",
  "peticiones": "Salud y bendición",
  "quiere_visita": true,
  "se_congrega_iglesia": false
}
```

## Estructura del proyecto

```
datos-invasion/
├── app.js                    # Punto de entrada
├── package.json
├── .env                      # Variables de entorno (no versionado)
├── .env.example              # Ejemplo de variables de entorno
├── .gitignore
├── README.md
├── AGENTS.md                 # Guía para agentes de IA
├── src/
│   ├── config/
│   │   └── db.js             # Pool de conexión MySQL
│   ├── middleware/
│   │   └── errorHandler.js   # Manejador de errores global
│   ├── repositories/
│   │   └── personaRepository.js  # Acceso a datos (SQL)
│   ├── routes/
│   │   └── personas.js       # Rutas del API
│   ├── services/
│   │   └── personaService.js # Lógica de negocio
│   └── utils/
│       └── errors.js         # Clases de error personalizadas
└── views/
    └── index.html            # Interfaz de usuario (SPA)
```

## Licencia

Este proyecto es de uso interno de **Centros Cristianos Cielos Abiertos**.
