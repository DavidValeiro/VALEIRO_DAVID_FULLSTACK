# Usuadex

API de usuarios con autenticación JWT, roles de administrador y avatares
Pokémon. Fullstack: API REST sobre MongoDB y SPA de React.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%209-47A248?style=flat-square&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

---

## Funcionalidades

- **Registro público** con selector de Pokémon y login automático al terminar.
- **Login con JWT** (1 h de duración) y cierre de sesión.
- **Dos roles**: `admin` con control total, usuario normal en modo solo lectura.
- **CRUD de usuarios**: listar, buscar por `ObjectId`, crear, editar y borrar.
- **Contraseñas con hash bcrypt**, nunca en claro.
- **Rate limit por IP**: 2 peticiones por segundo, con purga de las cuentas
  creadas en masa.
- **Pokédex** con las 9 generaciones, filtro por nombre o número, variante shiny
  y renderizado acotado para no cargar 1025 imágenes a la vez.
- **Interfaz neobrutalista** con animaciones propias, toasts de confirmación y
  soporte para `prefers-reduced-motion`.

## Stack

**Back** — Node.js 22, CommonJS

| Paquete | Versión | Uso |
| --- | --- | --- |
| express | ^5.2.1 | Servidor y routing |
| mongoose | ^9.7.4 | ODM y conexión a MongoDB |
| bcryptjs | ^3.0.2 | Hash de contraseñas |
| jsonwebtoken | ^9.0.3 | Emisión y verificación de JWT |
| helmet | ^8.3.0 | Cabeceras de seguridad |
| cors | ^2.8.6 | CORS |
| dotenv | ^17.4.2 | Variables de entorno |

**Front** — React sobre Vite, módulos ES

| Paquete | Versión | Uso |
| --- | --- | --- |
| react / react-dom | ^19.2.8 | UI |
| react-router-dom | ^7.9.2 | Rutas |
| vite | ^8.2.0 | Bundler y dev server |
| tailwindcss + @tailwindcss/vite | ^4.1.12 | Estilos |

## Estructura

```
Pec05/
├── back/
│   ├── index.js                  # Bootstrap: middlewares y rutas
│   ├── config/db.js              # Conexión a MongoDB (memoizada)
│   ├── models/
│   │   ├── user.js               # Esquema User
│   │   └── requestLog.js         # Esquema RequestLog + índice TTL
│   ├── controllers/
│   │   └── users-controllers.js  # Lógica de los endpoints
│   ├── middlewares/              # authorization, adminOnly, rate limit, errores
│   └── routes/users.js           # Tabla de rutas /users
└── front/
    ├── index.html
    ├── vite.config.js
    ├── vercel.json               # Rewrite SPA para Vercel
    ├── public/                   # favicon e imagen del login
    └── src/
        ├── main.jsx              # Punto de entrada
        ├── App.jsx               # Rutas (/login, /users)
        ├── api.js                # Cliente HTTP y gestión del token
        ├── pokemon.js            # PokéAPI, sprites y generaciones
        ├── index.css             # Keyframes y clases propias
        ├── pages/                # Login, Users
        └── components/           # Navbar, Register, UserCard, UserForm,
                                  # PokemonPicker, Toast
```

## Modelo de datos

`User` (`back/models/user.js`)

| Campo | Tipo | Restricciones |
| --- | --- | --- |
| `name` | String | required |
| `email` | String | required, único |
| `password` | String | required, hash bcrypt |
| `ip` | String | IP del registro, no se expone en lecturas |
| `is_admin` | Boolean | por defecto `false` |
| `pokemon` | Object | `{ id, name, shiny }`, avatar opcional |
| `createdAt` / `updatedAt` | Date | automáticos |

`RequestLog` (`back/models/requestLog.js`) guarda la IP de cada petición con un
índice TTL de 60 s. Solo alimenta el rate limit y nunca se expone por la API.

## Instalación

Clona el repositorio y entra en la carpeta de cada aplicación. **No hay
instalación desde la raíz**: los dos proyectos son independientes.

### 1. Base de datos

MongoDB debe estar levantado. En local no hay nada que configurar: el proyecto
apunta por defecto a `mongodb://localhost:27017/pec05`. Para usar MongoDB Atlas,
define `MONGODB_URI` en `back/.env` (ver abajo).

### 2. Back

```bash
cd back
npm install
```

Crea `back/.env`:

```dotenv
MONGODB_URI="mongodb://localhost:27017/pec05"
JWT_SECRET="cambia-esto-por-una-cadena-larga-y-aleatoria"
```

Arranca:

```bash
node index.js
```

No hay script `npm start`; el arranque es directo. Queda escuchando en
`http://localhost:3000`.

### 3. Front

```bash
cd front
npm install
```

Crea `front/.env` (opcional, si el back no está en el puerto 3000):

```dotenv
VITE_API_URL=http://localhost:3000
```

Arranca:

```bash
npm run dev
```

## Uso

1. Abre la URL que indique Vite.
2. Regístrate en la pantalla de inicio de sesión: elige tu Pokémon y la cuenta se
   crea ya iniciada.
3. Como el registro público solo crea usuarios normales, verás la lista en modo
   **solo lectura**.
4. Para probar las funciones de administrador, promociona un usuario a admin
   desde MongoDB:

```javascript
db.users.updateOne(
  { email: "tu@email.com" },
  { $set: { is_admin: true } }
)
```

5. Vuelve a iniciar sesión y aparecerán el buscador por ID, el botón de crear y
   las acciones de editar y eliminar.

## Endpoints

El token viaja en la cabecera `Authorization: Bearer <token>`.

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| POST | `/users/register` | — | Registro público. Fuerza `is_admin: false`. |
| POST | `/users/login` | — | Devuelve `{ token }`. |
| POST | `/users` | admin | Alta de usuario, puede ser admin. |
| GET | `/users` | — | Listado, sin `password` ni `ip`. |
| GET | `/users/:id` | — | Búsqueda por `ObjectId`, sin `password` ni `ip`. |
| PUT | `/users/:id` | admin | Edición. Re-hashea la contraseña si llega. |
| DELETE | `/users/:id` | admin | Borrado. |

Además: `GET /` responde `Welcome to the API` y `GET /health` devuelve el estado
de la conexión a MongoDB y si `JWT_SECRET` está definido.

Ejemplos:

```bash
# Login
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tu@email.com","password":"tu-password"}'

# Listado
curl http://localhost:3000/users

# Crear usuario (necesita el token de un admin)
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Ada","email":"ada@example.com","password":"1234","is_admin":false}'
```

## Diseño

Estética neobrutalista: bordes gruesos, sombras duras sin difuminado y tipografía
en negrita. Los colores son literales, no variables CSS.

| Color | Uso |
| --- | --- |
| `#ffcb05` | Amarillo: acción principal y cabeceras. |
| `#e85d4a` | Rojo: acciones destructivas. |
| `#7AC74C` | Verde: éxito. |
| `#2a6ccb` | Azul: registro. |
| `#a855f7` | Morado: administrador. |
| `#fff8e7` | Crema: tarjetas. |
| `#f1eee6` | Fondo de página. |
| `#172033` | Tinta: bordes y sombras. |

Los sprites se renderizan en pixel art (`image-rendering: pixelated`). Las
animaciones —carta 3D del login, despliegue de formularios, entrada de tarjetas,
toasts— son clases CSS propias de `front/src/index.css`, y todas respetan
`prefers-reduced-motion`.

## Despliegue

**Front en Vercel**: se despliega tal cual. `vercel.json` reescribe todas las
rutas a `index.html`, necesario para que el router del cliente funcione al
recargar. Hay que definir `VITE_API_URL` apuntando al back desplegado.

**Back en Vercel**: la conexión a MongoDB se abre de forma perezosa y se
reintenta, porque en un entorno serverless cada invocación es una función
nueva. Fuera de Vercel, un fallo de conexión detiene el proceso.

**MongoDB**: en producción, un cluster de Atlas. Define `MONGODB_URI` y
`JWT_SECRET` como variables de entorno del proyecto, nunca en un fichero
versionado.

## Documentación

| Fichero | Contenido |
| --- | --- |
| [`PLAN.md`](./PLAN.md) | Objetivo, alcance, entidades, API, fases y decisiones. |
| [`AGENTS.md`](./AGENTS.md) | Convenciones de código, seguridad y trampas del proyecto. |
| [`SKILLS.md`](./SKILLS.md) | Ajustes y variables configurables, valores por defecto. |

## Autor

**David Valeiro** — [GitHub](https://github.com/DavidValeiro/VALEIRO_DAVID_FULLSTACK)
