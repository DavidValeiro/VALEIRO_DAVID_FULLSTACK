# SKILLS.md — PEC05 (Usuadex)

Referencia de **todos los ajustes configurables del proyecto**: variables de
entorno, constantes con valores por defecto y ficheros de configuración. Sirve
para saber qué se puede cambiar sin leer el código, y con qué efecto.

Para el porqué de cada decisión de diseño, ver `PLAN.md`. Para conventions al
escribir código, ver `AGENTS.md`.

---

## 1. Variables de entorno

### 1.1 Back (`back/.env`)

| Variable | Obligatoria | Por defecto | Efecto |
| --- | --- | --- | --- |
| `MONGODB_URI` | En producción | `mongodb://localhost:27017/pec05` | Cadena de conexión a MongoDB. Sin ella se intenta el servidor local. |
| `JWT_SECRET` | **Sí** | — | Clave de firma de los tokens. Sin ella `jwt.sign` falla al hacer login. |
| `PORT` | No | `3000` | Puerto del servidor HTTP. |
| `VERCEL` | No | — | Lo inyecta Vercel automáticamente. No la definas a mano. |

`JWT_SECRET` **no tiene valor por defecto ni se valida al arrancar**: si falta,
el servidor levanta igual y solo falla el login. `GET /health` lo reporta con
`jwtSecretSet: true|false` para poder comprobarlo de un vistazo. Para generar
una:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

**Plantilla de `back/.env`** (equivalente a `back/.env.example`, que está
borrado del working tree; ver §5):

```dotenv
MONGODB_URI="mongodb://<usuario>:<password>@<host>:27017/pec05?tls=true&authSource=admin&retryWrites=true"
JWT_SECRET="<tu-secreto>"
```

La cadena de ejemplo es la de **MongoDB Atlas**. En local basta con el valor por
defecto. `getConnectionInfo()` sanea la URI antes de exponerla, sustituyendo
usuario y contraseña por `****:****` y eliminando el query string, de modo que
`/health` nunca filtra credenciales.

### 1.2 Front (`front/.env`)

| Variable | Obligatoria | Por defecto | Efecto |
| --- | --- | --- | --- |
| `VITE_API_URL` | No | `http://localhost:3000` | Base del cliente HTTP. Sin ella el front apunta al back local. |

**Plantilla de `front/.env`** (equivalente a `front/.env.example`, también
borrado; ver §5):

```dotenv
VITE_API_URL=http://localhost:3000
```

Las variables de Vite solo se inyectan en el bundle si llevan el prefijo
`VITE_`. Cualquier otra no llega al navegador. Como `VITE_API_URL` acaba
compilada en el `dist`, es pública: no pongas ahí un secreto.

### 1.3 Despliegue

En Vercel, `MONGODB_URI` y `JWT_SECRET` se configuran como variables de entorno
del proyecto. `VERCEL` no hay que añadirla. `PORT` la gestiona la plataforma.

---

## 2. Constantes del back

Valores de código: se cambian editando el fichero indicado.

| Ajuste | Valor | Dónde | Efecto |
| --- | --- | --- | --- |
| Timeout de selección de servidor | `15000` ms | `config/db.js:11` | Cuánto espera `mongoose.connect` antes de fallar. |
| Matar el proceso si falla Mongo | `1` (salir) | `config/db.js:21-23` | Solo fuera de Vercel. Con `VERCEL` definido no se sale y el error se propaga para que cada invocación serverless reintente. |
| Coste de bcrypt | `10` | `controllers/users-controllers.js:8,25,99` | Coste del hash. Mayor = más lento y más seguro. |
| Expiración del JWT | `1h` | `controllers/users-controllers.js:59` | Vida del token. Sin refresh token. |
| Contenido del JWT | `{ id, email, is_admin }` | `controllers/users-controllers.js:57` | Lo que se firma; `authorization` lo deja en `req.user`. |
| Ventana del rate limit | `1000` ms | `middlewares/registerRateLimit.js:4` | Tamaño de la ventana de conteo. |
| Peticiones por ventana | `2` | `middlewares/registerRateLimit.js:5` | A partir de la tercera dentro de la ventana se responde `429` **y se borran los usuarios creados por esa IP en la ventana**. |
| TTL de `RequestLog` | `60` s | `models/requestLog.js:9` | Autolimpieza de la colección de conteo; coincide con la ventana. |
| Pokémon por defecto | `{ id: 132, name: 'ditto', shiny: false }` | `controllers/users-controllers.js:33` | Se asigna si el registro no envía `pokemon`. |
| Orígenes CORS | `*` con `credentials: true` | `index.js:16-19` | CORS abierto a cualquier origen. |
| Cabeceras de seguridad | `helmet()` por defecto | `index.js:20` | Sin opciones; no relajar. |
| Límite del cuerpo JSON | Por defecto de `express.json()` (~100 kB) | `index.js:21` | Tope del body sin configurar. |
| Conexión viva | `readyState === 1` | `index.js:25` | Condición para que `/health` responda `status: ok`. |

### 2.1 Orden de middlewares (`index.js`)

El orden importa y está en el fichero, no en configuración:

```
cors → helmet → express.json
GET /health   GET /
ensureDb → registerRateLimit
/users        (authorization → adminOnly según ruta)
notFound → errorHandler
```

`ensureDb` y `registerRateLimit` están **antes** de las rutas; `notFound` y
`errorHandler` al final, como cola de error. `registerRateLimit` además se
repite en `routes/users.js:8`, así que un `POST /users/register` pasa por él
dos veces.

### 2.2 CORS

`index.js:16-19` usa `origin: '*'` junto a `credentials: true`. Según la
especificación CORS esa combinación es inválida y los navegadores rechazan las
peticiones con credenciales; con el token en cabecera `Authorization` la
aplicación funciona porque no se usan cookies. Si algún día se pasan a
cookies, habrá que sustituir `'*'` por una lista explícita de orígenes.

---

## 3. Constantes del front

| Ajuste | Valor | Dónde | Efecto |
| --- | --- | --- | --- |
| Base de la API | `http://localhost:3000` | `src/api.js:1` | Fallback si no hay `VITE_API_URL`. |
| Clave del token | `pec05_token` | `src/api.js:4,13,22` | `localStorage`; guarda el JWT. |
| Clave del rol | `pec05_is_admin` | `src/api.js:8,15,23` | `localStorage`; se deriva decodificando el payload del JWT. |
| Clave del Pokédex | `pec05_poke_list` | `src/components/PokemonPicker/PokemonPicker.jsx:11` | `sessionStorage`; cachea el listado. Borrarla fuerza una refetch. |
| API de Pokémon | `https://pokeapi.co/api/v2` | `src/pokemon.js:1` | Listado de Pokémon. |
| CDN de sprites | `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon` | `src/pokemon.js:2` | Imágenes, normales y shiny. |
| Pokémon descargados | `limit=1025&offset=0` | `src/components/PokemonPicker/PokemonPicker.jsx:24` | Toda la Pokédex en una petición. |
| Generaciones | I (1-151) … IX (906-1025) | `src/pokemon.js:8-18` | Rangos de las pestañas. |
| Fichas por lote | `MAX_TILES = 160` | `src/components/PokemonPicker/PokemonPicker.jsx:8` | Tope renderizado; se avisa si el filtro es más ancho. |
| Tamaño de ficha | `TILE_H = 112`, `GRID_GAP = 12` | `src/components/PokemonPicker/PokemonPicker.jsx:5-7` | Calculan `ROW_H` y la ventana de scroll. |
| Columnas de la galería | `8` / `6` / `4` | `src/components/PokemonPicker/PokemonPicker.jsx:132` | Según `min-width` 768 px, 640 px o móvil. |
| Aviso del toast | `2000` ms | `src/components/Toast/Toast.jsx:8` | Espera antes de la animación de salida. |
| Cierre del editor en tarjeta | `CLOSE_DURATION = 380` ms, `BORDER_PX = 8` | `src/components/UserCard/UserCard.jsx:7-8` | Duración y grosor del borde para animar la altura. |
| Cierre del formulario de alta | `CREATE_CLOSE_MS = 450` ms | `src/pages/Users.jsx:9` | Debe cuadrar con `unfurl` (0.45 s) de `index.css`. |
| Autoescalado del login | `min(1, (vh-96)/alto, (vw-48)/ancho)`, mínimo `0.4` | `src/pages/Login.jsx:22-23` | Encaja la carta de login en cualquier pantalla. |
| Tamaño del email en tarjeta | `base = 14` px, `min = 9` px | `src/components/UserCard/UserCard.jsx:261` | Ajuste fino del texto largo del email. |

### 3.1 Tokens del diseño

Definidos como clases de Tailwind y colores sueltos en el JSX, no como
variables CSS. Si hay que cambiar el aspecto global, buscar y reemplazar:

| Color | Uso |
| --- | --- |
| `#ffcb05` | Amarillo: acción principal, cabeceras, foco. |
| `#e85d4a` | Rojo: destructivo, errores, cerrar sesión. |
| `#7AC74C` | Verde: éxito (toast). |
| `#2a6ccb` | Azul: pantalla de registro. |
| `#a855f7` | Morado: tarjeta de administrador. |
| `#fff8e7` | Crema: tarjetas y formularios. |
| `#f1eee6` | Fondo de página. |
| `#172033` | Tinta: bordes y sombras duras. |

Sombras: `shadow-[4px_4px_0_#172033]` en botones, `[6px_6px_0_#172033]` en
tarjetas, `[3px_3px_0_#172033]` en botones pequeños.

Clases de animación propias definidas en `src/index.css`: `deck-stage`,
`deck-card`, `deck-front`, `deck-back`, `despliegue`, `despliegue-inner`,
`despliegue-cerrar`, `card-drop`, `reveal-stagger`, `toast-in`, `toast-out`,
`modal-fade`, `slide-from-top`, `poke-tile`, `pixel-art`.

Cualquier animación nueva debe añadirse también al bloque
`@media (prefers-reduced-motion: reduce)` del final de `index.css`.

---

## 4. Puesta en marcha

El orden importa: MongoDB debe estar vivo antes de arrancar el back, y el back
antes de abrir el front.

**1. MongoDB**

- Local: nada que hacer, se usa `mongodb://localhost:27017/pec05`.
- Atlas: poner `MONGODB_URI` en `back/.env` con los datos reales del cluster.

**2. Back**

```bash
cd back
npm install
node index.js
```

**3. Comprobar la API antes de seguir**

```bash
curl http://localhost:3000/health
```

Debe devolver `"status": "ok"`. Si devuelve `error`, mira `readyState` y el
campo `error`:

| `readyState` | Significado |
| --- | --- |
| `0` | Desconectado. |
| `1` | Conectado. Es el único valor que da `ok`. |
| `2` | Conectando. |
| `3` | Desconectando. |

`uriSet: false` significa que falta `MONGODB_URI` y se está usando el servidor
local. `jwtSecretSet: false` significa que los logins fallarán: define
`JWT_SECRET` y reinicia.

**4. Front**

```bash
cd front
npm install
npm run dev
```

Abre la URL que indique Vite (`http://localhost:5173` por defecto; el script
usa `vite --host`, así que también queda accesible desde la red local).

**5. Crear el primer administrador**

El registro público siempre crea usuarios normales, así que hace falta un admin:

1. Regístrate por la interfaz (se crea un usuario normal).
2. Promoviéndolo manualmente: en MongoDB, `db.users.updateOne({ email: "tu@email" }, { $set: { is_admin: true } })`.

---

## 5. Nota — ficheros de plantilla borrados

Estos tres ficheros están en `HEAD` pero no en el working tree:

- `Pec05/attack.js` — script de carga que lanzaba 10 registros en paralelo
  contra `/users/register` de la API desplegada, para provocar el rate limit y
  comprobar la purga de cuentas.
- `Pec05/back/.env.example` — plantilla de `MONGODB_URI` y `JWT_SECRET`,
  reproducida en §1.1.
- `Pec05/front/.env.example` — plantilla de `VITE_API_URL`, reproducida en §1.2.

Para recuperarlos:

```bash
git checkout -- Pec05/back/.env.example Pec05/front/.env.example
```

`.gitignore` ignora `.env` y `.env.*` pero conserva los ejemplos con la negación
`!.env.example`, así que restaurarlos no arriesga subir secretos. Si prefieres
no depender de git, crea `back/.env.example` y `front/.env.example` copiando los
bloques de §1.

---

## 6. Comprobaciones útiles

```bash
# Estado de la API
curl http://localhost:3000/health

# Login (devuelve { "token": "..." })
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tu@email.com","password":"tu-password"}'

# Listado (público, no requiere token)
curl http://localhost:3000/users

# Alta de usuario (requiere token de admin)
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Ada","email":"ada@example.com","password":"1234","is_admin":false}'

# Probar el rate limit: la tercera llamada dentro de 1 s debe dar 429
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"a","email":"a@a.a","password":"1234"}'
```

Respuestas de error que conviene reconocer: `Authorization header missing` y
`Invalid token` (401) indican token ausente o caducado; `Forbidden: admin
access required` (403) indica que el usuario no es administrador.
