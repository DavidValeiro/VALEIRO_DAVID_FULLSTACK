# 38diaNEXT — Chuleta de continuidad

> Lee este archivo al retomar. **Bórralo cuando el proyecto esté terminado.**

---

## 1. Qué se pidió (estado actual)

1. Partir de la copia `38dia` llamada `38diaNEXT` y convertirla en un proyecto **Next.js real**
   (sin `front/` ni `back/`).
2. **Integrar toda la Pec05 (Usuadex)** dentro de esa misma app: usuarios con Pokémon, roles,
   registro, login, panel CRUD de usuarios, Pokédex y rate limit por IP.
3. **Atlas de Pec05 como única base de datos**: posts, comentarios y usuarios viven en el cluster.
4. **Neobrutalismo en toda la interfaz**.
5. **Borrar los datos locales** y empezar limpio.

Todo hecho. `npm run build` pasa y la API está probada contra Atlas.

---

## 2. Decisiones cerradas

| Decisión | Motivo |
| --- | --- |
| Todo en Next.js Route Handlers | El front y la API son el mismo origen: no hay CORS ni `NEXT_PUBLIC_API_URL` |
| Atlas `pec05` (cluster sharded) | El SRV falla en Node con `querySrv ECONNREFUSED`; se usa la URI con la lista explícita de shards |
| Se reutilizan los 8 usuarios de Pec05 | No se tocan contraseñas ni Pokémon; solo se normaliza el email a minúsculas |
| Neobrutalismo global | Paleta y clases de Pec05 volcadas en `globals.css` y los componentes |

### Paleta (de Pec05)

`#ffcb05` acción · `#e85d4a` destructivo · `#7AC74C` éxito · `#2a6ccb` registro ·
`#a855f7` admin · `#fff8e7` crema (tarjetas) · `#f1eee6` fondo · `#172033` tinta.

Tokens recurrentes: `border-4 border-slate-950`, `font-black`,
`shadow-[4px_4px_0_#172033]`, `rounded-xl` / `rounded-3xl` / `rounded-4xl`,
`uppercase tracking-[0.2em]` en etiquetas.

---

## 3. Estructura

```
38diaNEXT/
├── package.json            next 16.3.7, react 19, mongoose, bcryptjs, jsonwebtoken, tailwind v4
├── .env.local              MONGODB_URI (shards de Atlas), JWT_SECRET, JWT_EXPIRES_IN
├── .env.example            plantilla; base por defecto `pec05`
├── scripts/seed.mjs        seed de posts y comentarios sobre los usuarios existentes
└── src/
    ├── app/
    │   ├── layout.jsx            <AuthProvider> + <Navbar>
    │   ├── globals.css           Tailwind v4 + clases neobrutalistas de Pec05
    │   ├── page.jsx              feed de posts (PÚBLICA)
    │   ├── login/page.jsx        <Suspense> por useSearchParams
    │   ├── register/page.jsx     con <PokemonPicker>
    │   ├── users/page.jsx        ← Usuadex: listado, búsqueda por ID, alta y CRUD (solo admin)
    │   ├── posts/new/page.jsx    <RequireAuth> + <PostForm>
    │   ├── posts/[id]/page.jsx   detalle + comentarios (PÚBLICA)
    │   ├── posts/[id]/edit/page.jsx
    │   └── api/
    │       ├── auth/login/route.js      POST
    │       ├── auth/register/route.js   POST  ← rate limit por IP
    │       ├── users/route.js           GET (público), POST (solo admin)
    │       ├── users/[id]/route.js      GET (público), PUT/DELETE (solo admin)
    │       ├── posts/route.js           GET, POST
    │       ├── posts/[id]/route.js      GET, PUT, DELETE
    │       ├── posts/[id]/comments/route.js  GET, POST
    │       └── comments/[id]/route.js   GET, PUT, DELETE
    ├── components/
    │   ├── Navbar.jsx  RequireAuth.jsx  PostCard.jsx  PostForm.jsx  CommentSection.jsx
    │   ├── UserCard.jsx  UserForm.jsx  PokemonPicker.jsx  Toast.jsx
    │   └── Alert.jsx  Spinner.jsx
    ├── context/AuthContext.jsx
    └── lib/
        ├── api.js     fetch '/api...' + Authorization Bearer
        ├── auth.js    localStorage: 38dianext_token / 38dianext_user
        ├── format.js  fechas, iniciales, FileReader -> Base64
        ├── pokemon.js sprites, generaciones I–IX, rango 1–1025
        └── server/
            ├── db.js          conexión mongoose cacheada en globalThis
            ├── route.js       json / jsonError / route()
            ├── auth.js        signToken, verifyToken, getUser(request)
            ├── rateLimit.js   ← portado de Pec05 (2 peticiones / 1 s por IP)
            ├── ownership.js   isValidId, sameId, requireOwner
            ├── images.js      isValidImage, MAX_IMAGE_BYTES (5 MB)
            └── models/        user.js, post.js, comment.js, requestLog.js
```

---

## 4. Modelo de usuario fusionado

```js
{ name, email, password (select:false), is_admin, pokemon: {id,name,shiny} | null,
  ip (select:false), posts: [ObjectId], comments: [ObjectId] }
```

`GET /api/users` y `GET /api/users/:id` devuelven `-password -ip`.
Los `populate` de posts y comentarios usan `'name email pokemon'` para que salga el sprite.

---

## 5. Cómo arrancar

```bash
cd 38diaNEXT
npm install
npm run dev            # http://localhost:3000
npm run seed           # posts + comentarios de prueba sobre los 8 usuarios existentes
```

### Seed (`scripts/seed.mjs`)

- **No crea usuarios**: exige que existan los 8 de Pec05 y falla si falta alguno.
- Lee `.env.local` a mano (no hay `dotenv` como dependencia).
- **Borra** `posts` y `comments` y vacía `user.posts` / `user.comments` antes de sembrar.
- Crea **12 posts** y **17 comentarios** repartidos entre los 8 usuarios.
- Genera las imágenes **PNG de verdad** en Base64 (IHDR/IDAT/IEND con CRC32 propio), no data URI.
- **Normaliza los emails a minúsculas** (Pec05 guardaba `Yza@example.com` con mayúscula y el
  esquema declara `lowercase: true`; sin ese paso ese usuario no podía iniciar sesión).

### Verificación hecha (contra Atlas)

```
GET  /api/users                 -> 8 usuarios, sin password ni ip
GET  /api/posts                 -> 12 posts, autor con pokemon
GET  /api/posts/:id/comments    -> comentarios con pokemon
POST /api/users  (sin token)    -> 401
POST /api/auth/register        -> 201, is_admin=false, pokemon=pikachu shiny
POST /api/auth/login (ok)       -> token
POST /api/auth/login (mal)      -> 401
```

El usuario de humo se borró después. Atlas queda en `users 8 / posts 12 / comments 17`.
La base local `38dianext` se borró dos veces y está vacía.

---

## 6. QUEDA PENDIENTE

- [ ] **Probar la UI a mano en el navegador**: feed, login, registro con Pokédex, `/users` con un
      admin (crear, editar Pokémon, eliminar) y con un usuario normal (solo lectura).
- [ ] **Rotar las credenciales de Atlas**: están en el historial de Git (`git log --all -p -S "pec05-cluster"`).
- [ ] **Escribir el `README.md`** del proyecto (no existe todavía).
- [ ] **Commit**: nada está commiteado. `38dia/` y `38diaNEXT/` están sin trackear. No hacer commit
      hasta que el usuario lo pida. Y **borrar este archivo antes**.

---

## 7. Errores ya resueltos (no repetirlos)

1. `useSearchParams() should be wrapped in a suspense boundary at page "/login"` →
   se partió `LoginPage` en `LoginForm` + `<Suspense>`.
2. *Next.js inferred your workspace root* (dos `package-lock.json`) → se solucionó al aplanar;
   además `next.config.mjs` fija `turbopack: { root }`.
3. `Start-Process` con `npx` falla en este entorno; hay que lanzar
   `cmd /c npx next start -p 3100` **con redirección a log** y `Start-Sleep` antes de curl-ear.
4. **Cuidado con servidores de pruebas viejos**: uno de una sesión anterior seguía ocupando el
   3100 con el build viejo y `.env.local` viejo (localhost), y por eso `GET /api/users` devolvía 0
   y `POST /api/users` sin token devolvía 201. Matar el proceso del puerto antes de testear:
   `Get-NetTCPConnection -LocalPort 3100 -State Listen | % { Stop-Process -Id $_.OwningProcess -Force }`.
5. Un script suelto en `%TEMP%` no resuelve `mongoose`; hay que copiarlo dentro del proyecto
   para que encuentre `node_modules`.
6. Los acentos se ven mal en la consola de PowerShell 5.1, pero los ficheros están bien en UTF-8
   (comprobar con `[System.Text.Encoding]::UTF8.GetString(bytes)` y contar `\uFFFD`).