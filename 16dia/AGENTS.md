# AGENTS.md — PEC05 (Usuadex)

Instrucciones y contexto para agentes y herramientas de IA que trabajen en esta
carpeta. Lee este archivo antes de tocar código.

## 1. Qué es esto

`Pec05` es un monorepo con dos aplicaciones independientes:

- **`back/`** — API REST de usuarios. Node.js 22, Express 5, Mongoose 9 sobre
  MongoDB, CommonJS. Auth por JWT, roles admin/usuario, rate limit por IP.
- **`front/`** — SPA de usuarios. React 19, Vite 8, react-router-dom 7,
  TailwindCSS 4, módulos ES. Estética neobrutalista con avatares Pokémon.

Cada carpeta tiene su propio `package.json` y sus propias dependencias: **instala
y ejecuta por separado**, nunca desde la raíz.

`PLAN.md` en esta misma carpeta documenta objetivo, alcance, entidades, API,
fases y decisiones de diseño. Consúltalo para el porqué antes de cambiar el qué.

## 2. Comandos

**Back**

```bash
cd back
npm install
node index.js          # escucha en PORT o 3000
```

No hay script `start`; el arranque es `node index.js`. Tampoco hay lint ni tests
configurados. `index.js` solo llama a `app.listen` si el módulo es el principal
(`require.main === module`) y exporta `app`, así que se puede importar en tests
sin abrir un puerto.

**Front**

```bash
cd front
npm install
npm run dev            # vite --host
npm run build          # build de producción
npm run preview
```

**Comprobación de la API**

```bash
curl http://localhost:3000/health
```

Devuelve `status`, si hay `MONGODB_URI`, la URI **saneada** (contraseña
enmascarada), `readyState` y `jwtSecretSet`.

## 3. Variables de entorno

| Variable | Dónde | Default | Para qué |
| --- | --- | --- | --- |
| `MONGODB_URI` | `back/` | `mongodb://localhost:27017/pec05` | Cadena de conexión |
| `JWT_SECRET` | `back/` | — | Firma de los JWT (obligatoria) |
| `VITE_API_URL` | `front/` | `http://localhost:3000` | Base del cliente HTTP |
| `PORT` | `back/` | `3000` | Puerto del servidor |

Se leen con `dotenv` (back) o `import.meta.env` (front). **Nunca escribas un
valor real en un fichero versionado** y nunca imprimas estas variables en logs:
`/health` ya expone la URI saneada y un booleano en vez del secreto.

## 4. Convenciones del back

- **CommonJS**: `require` / `module.exports`. Sin `import`/`export`, sin `"type":
  "module"` en `package.json`.
- **4 espacios** de indentación, comillas simples, punto y coma al final.
- Nombres de fichero en minúsculas y con guion: `users-controllers.js`,
  `not-found.js`, `errorHandler.js`.
- Los controladores usan **cadenas de promesas `.then()`**, no `async/await`.
  Mantén ese estilo al añadirlos; los middlewares sí usan `async` cuando
  necesitan `await` (`registerRateLimit`).
- Un controlador nunca lanza: captura y responde con
  `res.status(n).json({ message })`.
- Mantén el orden de middlewares de `index.js`. `ensureDb` y
  `registerRateLimit` van **antes** de las rutas, y `notFound` / `errorHandler`
  al final, como cola de error.
- Al añadir una ruta, protéjala con `authorization` y, si es de escritura,
  también con `adminOnly`.
- Al exponer un usuario, mantén `.select('-password')` (y `'-ip'` en las
  lecturas). No devuelvas nunca el hash.

## 5. Convenciones del front

- **Módulos ES**, `"type": "module"`. Imports sin extensión.
- **2 espacios** de indentación, comillas simples, punto y coma.
- Sin comillas en los atributos JSX salvo que el valor lo requiera.
- Componentes como `function Nombre() {}` con `export default` al final. No hay
  `React` importado: se usa el JSX transform automático.
- **Un componente por carpeta** en `components/X/X.jsx` (convención ya
  establecida: `Navbar/Navbar.jsx`, `UserCard/UserCard.jsx`...).
- Las **páginas** viven en `src/pages/`. El acceso a datos pasa **siempre** por
  `src/api.js`; no hagas `fetch` a mano en un componente.
- Tailwind por clases de utilidad. Las animaciones y efectos reutilizables van
  como clases CSS en `src/index.css`, no en `style={{}}` en línea.

## 6. Sistema de diseño (no lo rompas)

Estética neobrutalista coherente en toda la app. Antes de maquetar, reutiliza:

- **Paleta**: `#ffcb05` (amarillo, acción principal), `#e85d4a` (rojo,
  destructivo), `#7AC74C` (verde, éxito), `#2a6ccb` (azul, registro),
  `#a855f7` (morado, admin), `#fff8e7` (crema, tarjetas), `#f1eee6` (fondo),
  `#172033` (tinta). Los sprites usan `image-rendering: pixelated`.
- **Tokens recurrentes**: `border-4 border-slate-950`, `font-black`,
  `shadow-[4px_4px_0_#172033]`, `rounded-xl` / `rounded-4xl`,
  `uppercase tracking-[0.2em]` en etiquetas.
- **Clases propias** en `index.css`: `deck-stage`, `deck-card`, `deck-front`,
  `deck-back` (carta 3D), `despliegue` / `despliegue-inner` / `despliegue-cerrar`
  (despliegue), `card-drop`, `reveal-stagger`, `toast-in` / `toast-out`,
  `modal-fade`, `slide-from-top`, `poke-tile`, `pixel-art`.
- Cualquier animación nueva debe quedar cubierta por el bloque
  `@media (prefers-reduced-motion: reduce)` del final de `index.css`.
- Los modales y confirmaciones se montan con `createPortal` a `document.body`.

## 7. Reglas de seguridad

- Contraseñas **siempre** con `bcrypt.hash` (factor 10) y comparación con
  `bcrypt.compare`. Nunca guardes ni registres contraseñas en claro.
- `adminOnly` consulta la base de datos a propósito: no lo reemplaces por una
  comprobación del claim `is_admin` del token, que puede estar caducado.
- El registro público fuerza `is_admin: false` en el servidor. No lo cambies
  para permitir auto-registro de admins.
- Rate limit: respeta los parámetros de `registerRateLimit.js` (2 peticiones,
  ventana de 1 s) y su borrado de usuarios abusivos. Es intencionado.
- No relajes `helmet` ni introduzcas `origin: '*'` en más sitios.
- Los ficheros `.env` están ignorados por `.gitignore`. Commitea solo
  `.env.example`.

## 8. Trampas del código actual

- **El rate limit está montado globalmente** en `index.js`, no solo en
  `/users/register`, y además se repite en la propia ruta de registro. Una
  petición a `POST /users/register` pasa por él **dos veces**. Está así a
  propósito, pero no lo dupliques por error al añadir rutas.
- La IP se toma de `x-forwarded-for` (primera entrada) y, si no existe, de
  `req.socket.remoteAddress`. El middleware la deja en `req.clientIp`, que es lo
  que usa `registerUser` para guardar la IP del usuario.
- `GET /users` y `GET /users/:id` **no requieren token** en
  `back/routes/users.js`. Solo las rutas de escritura están protegidas.
- `updateUser` descarta `_id` pero acepta el resto de `req.body`; no amplíes los
  campos que acepta sin decidirlo antes.
- `config/db.js` cachea la promesa de conexión: solo se llama una vez a
  `mongoose.connect`, y si falla se libera para permitir reintento. No la
  llames en cada arranque esperando una conexión nueva.
- Fuera de Vercel, un fallo de conexión hace `process.exit(1)`. En Vercel
  (`process.env.VERCEL`) no se mata el proceso y el error se propaga para que cada
  invocación serverless reintente.
- `PokemonPicker` limita la galería a 160 fichas (`MAX_TILES`) y cachea el
  listado en `sessionStorage` bajo `pec05_poke_list` con una variable de módulo.
  El borrado de esa clave fuerza una refetch.

## 9. Antes de dar por terminado un cambio

- Back: arranca con `node index.js` y prueba a mano el endpoint afectado con
  `curl`, mirando `GET /health` para confirmar la conexión. Recuerda que
  `Authorization header missing` (401) y `Forbidden: admin access required` (403)
  son respuestas esperadas sin permisos.
- Front: ejecuta `npm run build`. Es la única verificación automatizada disponible.
- Si tocas el diseño, revisa la vista de **solo lectura** además de la de admin:
  `UserCard` y `Users` renderizan distinto según `canManage`, y ambos caminos
  deben seguir funcionando.

## 10. Nota — ficheros borrados sin commitear

Estos tres ficheros están en `HEAD` pero no en el working tree, así que no los
encontrarás en disco:

- `Pec05/attack.js` — script de carga que lanzaba 10 registros en paralelo para
  provocar el rate limit.
- `Pec05/back/.env.example` — plantilla de `MONGODB_URI` y `JWT_SECRET`.
- `Pec05/front/.env.example` — plantilla de `VITE_API_URL`.

Si necesitas las plantillas para un entorno nuevo, restáuralas con
`git checkout -- back/.env.example front/.env.example`; `.gitignore` las
preserva con la negación `!.env.example`. La sección 3 documenta sus variables.

## Ia utilizada para el proyecto.

- Big pickle y GitHub Copilot para autocompletar y sugerencias de código.