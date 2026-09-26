# PLAN — PEC05 · Usuadex (API de Usuarios)

Aplicación fullstack de gestión de usuarios con autenticación JWT, roles de
administrador y un selector de Pokémon como avatar. El front es una SPA de React
y el back una API REST sobre MongoDB. El nombre en pantalla de la aplicación es
**Usuadex**.

---

## 1. Objetivo

Construir una API de usuarios persistente y su interfaz web consumiéndola, con:

- Registro público y login con JWT.
- CRUD completo de usuarios.
- Dos roles: `admin` (control total) y usuario normal (solo lectura).
- Protección frente a la creación masiva de cuentas (rate limit por IP).
- Un avatar Pokémon elegible entre las 9 generaciones.

## 2. Alcance

**Incluido**

- Registro e inicio de sesión.
- Listado, búsqueda por ID, alta, edición y borrado de usuarios.
- Hash de contraseñas con bcrypt.
- Autenticación por JWT y control de acceso por rol.
- Rate limit por IP con purga de cuentas abusive.
- Galería de Pokémon con filtro, generaciones y variante shiny.
- Despliegue del front en Vercel.

**Fuera de alcance**

- Renovación de tokens (refresh token).
- Tests automatizados.
- Verificación de correo electrónico.
- Subida de imágenes de perfil.
- Cualquier otro dominio de negocio aparte de usuarios.

## 3. Stack

**Back (`back/`)** — Node.js 22, CommonJS.

| Paquete | Versión | Uso |
| --- | --- | --- |
| express | ^5.2.1 | Servidor y routing |
| mongoose | ^9.7.4 | ODM y conexión a MongoDB |
| bcryptjs | ^3.0.2 | Hash de contraseñas |
| jsonwebtoken | ^9.0.3 | Emisión y verificación de JWT |
| helmet | ^8.3.0 | Cabeceras de seguridad |
| cors | ^2.8.6 | CORS |
| dotenv | ^17.4.2 | Variables de entorno |

**Front (`front/`)** — React sobre Vite, módulos ES.

| Paquete | Versión | Uso |
| --- | --- | --- |
| react / react-dom | ^19.2.8 | UI |
| react-router-dom | ^7.9.2 | Rutas |
| vite | ^8.2.0 | Bundler y dev server |
| tailwindcss + @tailwindcss/vite | ^4.1.12 | Estilos |

## 4. Arquitectura

```
Pec05/
├── back/
│   ├── index.js                  # Bootstrap de la app
│   ├── package.json
│   ├── config/
│   │   └── db.js                 # Conexión a MongoDB (memoizada)
│   ├── models/
│   │   ├── user.js               # Esquema User
│   │   └── requestLog.js         # Esquema RequestLog + TTL
│   ├── controllers/
│   │   └── users-controllers.js  # Lógica de los 7 endpoints
│   ├── middlewares/
│   │   ├── authorization.js      # Verifica el Bearer JWT
│   │   ├── adminOnly.js          # Exige is_admin=true en BD
│   │   ├── registerRateLimit.js  # Rate limit por IP
│   │   ├── not-found.js          # 404
│   │   └── errorHandler.js       # Errores centralizados
│   └── routes/
│       └── users.js              # Tabla de rutas /users
└── front/
    ├── index.html
    ├── vite.config.js
    ├── vercel.json               # Rewrite SPA
    ├── public/
    │   ├── favicon.svg
    │   └── window-charmander.jpg
    └── src/
        ├── main.jsx              # Punto de entrada
        ├── App.jsx               # Rutas
        ├── api.js                # Cliente HTTP + token
        ├── pokemon.js            # PokéAPI, sprites, generaciones
        ├── index.css             # Keyframes y clases propias
        ├── pages/
        │   ├── Login.jsx
        │   └── Users.jsx
        └── components/
            ├── Navbar/Navbar.jsx
            ├── Register/Register.jsx
            ├── UserCard/UserCard.jsx
            ├── UserForm/UserForm.jsx
            ├── PokemonPicker/PokemonPicker.jsx
            └── Toast/Toast.jsx
```

**Flujo de una petición**

```
petición → cors → helmet → express.json
        → GET /health | GET /
        → ensureDb → registerRateLimit
        → /users (authorization → adminOnly según ruta)
        → notFound → errorHandler
```

## 5. Entidades

### 5.1 `User` — entidad principal

`back/models/user.js`. Con `timestamps: true`.

| Campo | Tipo | Restricciones | Notas |
| --- | --- | --- | --- |
| `_id` | ObjectId | generado | Identificador que expone la API |
| `name` | String | required | |
| `email` | String | required, unique | Credencial de login |
| `password` | String | required | Hash bcrypt, nunca el hash en claro |
| `ip` | String | — | IP del registro; nunca se devuelve en las lecturas |
| `is_admin` | Boolean | default `false` | `false` forzado en el registro público |
| `pokemon` | Object embebido | — | Subdocumento opcional `{ id: Number, name: String, shiny: Boolean }` |
| `createdAt` / `updatedAt` | Date | — | Automáticos |

`pokemon` es un subdocumento y no una colección aparte: el avatar pertenece al usuario y se lee siempre con él.

### 5.2 `RequestLog` — entidad de soporte

`back/models/requestLog.js`. Colección auxiliar que alimenta el rate limit.

| Campo | Tipo | Restricciones | Notas |
| --- | --- | --- | --- |
| `ip` | String | required | Clave de agrupación de la ventana |
| `createdAt` | Date | — | Índice TTL de 60 s: se autolimpia |

Solo se usa para contar peticiones por IP dentro de la ventana; nunca sale por la API.

## 6. API

Todas las rutas cuelgan de `/users` (`back/routes/users.js`). El token viaja en
la cabecera `Authorization: Bearer <token>`.

| Método | Ruta | Middleware | Descripción |
| --- | --- | --- | --- |
| POST | `/users/register` | `registerRateLimit` | Registro público; fuerza `is_admin: false` y guarda la IP |
| POST | `/users/login` | — | Valida credenciales y devuelve `{ token }` (JWT, 1 h) |
| POST | `/users` | `authorization`, `adminOnly` | Alta de usuario (puede ser admin) |
| GET | `/users` | — | Listado, sin `password` ni `ip` |
| GET | `/users/:id` | — | Búsqueda por `ObjectId`, sin `password` ni `ip` |
| PUT | `/users/:id` | `authorization`, `adminOnly` | Edición; re-hashea la contraseña si llega |
| DELETE | `/users/:id` | `authorization`, `adminOnly` | Borrado |

Rutas auxiliares en la raíz: `GET /` responde `Welcome to the API` y `GET /health`
devuelve el estado de la conexión, la URI saneada y si `JWT_SECRET` está definido.

**Payload**

- Registro: `{ name, email, password, pokemon? }`. Si no se envía `pokemon`, se
  asume Ditto (`id: 132`, `shiny: false`).
- Login: `{ email, password }` → `{ token }`.
- Alta admin: `{ name, email, password, is_admin, pokemon? }`.
- Edición: cualquiera de los anteriores; `_id` se descarta. La contraseña es
  opcional y solo se re-hashea si llega con valor.

El JWT contiene `{ id, email, is_admin }`. `authorization` valida la firma y deja
el payload en `req.user`; `adminOnly` **vuelve a consultar la base de datos** para
comprobar `is_admin`, de modo que el control de acceso no depende de un claim
potencialmente caducado del token.

## 7. Front

**Rutas** (`front/src/App.jsx`)

| Ruta | Componente | Acceso |
| --- | --- | --- |
| `/login` | `Login` | Público; login y registro en una carta que gira en 3D |
| `/users` | `Users` | Requiere token (`RequireAuth`) |
| `*` | — | Redirige a `/users` si hay token, si no a `/login` |

**Comportamiento de `Users`**

- Lista todos los usuarios en tarjetas.
- Solo si `is_admin`: buscador por `ObjectId`, botón de crear y acciones de
  editar/borrar. Un usuario normal ve un aviso de solo lectura.
- Alta y edición con el mismo `UserForm`; el borrado pide confirmación en un modal.
- Notificaciones con `Toast` para cada operación.

**Gestión de sesión** (`front/src/api.js`)

- `VITE_API_URL` con fallback a `http://localhost:3000`.
- Token en `localStorage` bajo `pec05_token`; el rol se cachea en
  `pec05_is_admin` decodificando el payload del JWT.
- `request()` adjunta el `Bearer` y convierte cualquier respuesta no 2xx en un
  `Error` con el mensaje del servidor.
- Ante `Authorization header missing` o `Invalid token`, se limpia el token y se
  vuelve a `/login`.

**Pokédex** (`front/src/pokemon.js`, `PokemonPicker`)

- Listado de los 1025 Pokémon desde `pokeapi.co`, cacheado en memoria y en
  `sessionStorage` (`pec05_poke_list`).
- Sprites desde el CDN de `PokeAPI/sprites`, con variante shiny.
- Filtro por nombre o número, pestañas por generación (I–IX) y renderizado
  acotado a 160 fichas con ventanaización por scroll.

**Sistema de diseño** — neobrutalista. Paleta: `#ffcb05` amarillo, `#e85d4a` rojo,
`#7AC74C` verde, `#2a6ccb` azul, `#a855f7` morado (admin), `#fff8e7` crema,
`#f1eee6` fondo, `#172033` tinta. Bordes gruesos `border-4 border-slate-950`, sombras
durdas `shadow-[4px_4px_0_#172033]`, tipografía `font-black`, sprites con
`image-rendering: pixelated`. Las animaciones viven como clases CSS propias en
`front/src/index.css` (`despliegue`, `card-drop`, `toast-in/out`, `deck-front/back`,
`reveal-stagger`) y todas respetan `prefers-reduced-motion`.

## 8. Variables de entorno

| Variable | Dónde | Obligatoria | Default |
| --- | --- | --- | --- |
| `MONGODB_URI` | `back/` | En producción | `mongodb://localhost:27017/pec05` |
| `JWT_SECRET` | `back/` | Sí | — (los tokens no se firman sin ella) |
| `VITE_API_URL` | `front/` | No | `http://localhost:3000` |

`PORT` también se lee del entorno, con default `3000`.

## 9. Fases

**Fase 1 — Base de datos y CRUD**

Modelos `User` y `RequestLog`, conexión a MongoDB con `mongoose.connect`
cacheando la promesa para no abrir varias conexiones, y el CRUD de usuarios con
`bcryptjs`. La API ya expone listar, buscar por ID, crear, editar y borrar.

**Fase 2 — Autenticación y roles**

`bcryptjs` para el hash, `jsonwebtoken` para emitir tokens de 1 h con
`{ id, email, is_admin }`, y los middlewares `authorization` y `adminOnly`.
El registro público queda forzado a usuario normal; solo un admin puede crear
usuarios, editarlos o borrarlos.

**Fase 3 — Seguridad**

`helmet` para las cabeceras, `cors`, y `registerRateLimit`: 2 peticiones por IP
y ventana de 1 s, con la IP tomada de `x-forwarded-for`. Cuando se supera el
límite, la API responde `429` y **borra los usuarios creados por esa IP dentro
de la ventana**, de modo que un script de alta masiva no deja rastro.
`RequestLog` usa un índice TTL de 60 s para que la propia ventana se autolimpie.
Se añaden además `not-found` y `errorHandler` como middlewares globales.

**Fase 4 — Front y Pokédex**

Login y registro en una carta 3D con autoescalado, panel de usuarios con
formularios, tarjetas editables en línea, modal de confirmación y toasts. El
selector de Pokémon consulta la PokéAPI, cachea el listado, y ofrece filtro,
generaciones, shiny y renderizado acotado para no cargar 1025 imágenes a la vez.

**Fase 5 — Despliegue**

`vercel.json` con el rewrite de la SPA al `index.html`, y `config/db.js`
distinguiendo el entorno de Vercel: si falla la conexión no se mata el proceso
(serverless), se propaga el error para que cada invocación reintente la conexión.

## 10. Nota — ficheros borrados sin commitear

`git status` muestra tres ficheros que existen en `HEAD` pero no en el working
tree, y que no están en el historial de este plan:

- `Pec05/attack.js` — script de carga que lanzaba 10 registros en paralelo contra
  `/users/register` con la API desplegada, para provocar el rate limit.
- `Pec05/back/.env.example` — plantilla de `MONGODB_URI` y `JWT_SECRET`.
- `Pec05/front/.env.example` — plantilla de `VITE_API_URL`.

Los valores de la sección 8 proceden de esas plantillas. Si se restauran con
`git checkout -- <ruta>`, `.gitignore` los tiene preservados mediante la negación
`!.env.example`.
