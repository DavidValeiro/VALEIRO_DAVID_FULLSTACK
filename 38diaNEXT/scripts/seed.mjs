import { readFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import mongoose from 'mongoose';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(here, '..');

loadEnv(path.join(projectRoot, '.env.local'));

const POSTS = [
  ['david.valeiro@example.com', 'Api 38dia: guía express de la API', 'Lo mínimo para empezar a consumir la API: rutas disponibles, autenticación por token y formato de respuesta.'],
  ['Yza@example.com', 'Neobrutalismo con Tailwind 4', 'Paleta de tinta dura, bordes gruesos y sombras sin difuminado. Clases propias en globals.css y tokens de color en el theme.'],
  ['pecezote@example.com', 'Pokemon sprites en el perfil', 'Cada usuario puede llevar un Pokémon, normal o shiny, y sale de la galería del Pokédex.'],
  ['nico@email.com', 'Cluster sharded de Atlas', 'La búsqueda SRV falla en algunos entornos de Node, así que la conexión usa la lista explícita de shards.'],
  ['carianbv14@gmail.com', 'Modelos duplicados en el historial', 'Pec05 usaba su propio esquema de usuario y 38diaNEXT el suyo. Fusionarlos fue más barato que mantener dos.'],
  ['CapulloQueMeQuitaElAdmin@example.com', 'Rate limit por IP', 'Dos registros por segundo y ventana de un segundo. Si te pasas, se devuelven tus usuarios de la ventana.'],
  ['Carmenvaleirosanjurjo@gmail.com', 'Comentarios en cascada', 'Al borrar un usuario se limpian sus publicaciones, sus comentarios y las referencias en el resto de posts.'],
  ['CapulloQueMeQuitaElAdmin2@example.com', 'El registro público nunca es admin', 'Aunque mandes is_admin en el body, el servidor lo fuerza a false en el registro abierto.'],
  ['Yza@example.com', 'Rutas protegidas con JWT', 'El token va en la cabecera Authorization. roleadmin se comprueba contra la base de datos, no contra el token.'],
  ['david.valeiro@example.com', 'Posts con imagen obligatoria', 'La imagen se envía en Base64 desde el navegador con un máximo de 5 MB por publicación.'],
  ['pecezote@example.com', 'Despliegue en Vercel', 'Cada invocación serverless reconecta, así que la promesa de conexión se cachea pero se libera si falla.'],
  ['nico@email.com', 'Recortes de texto en las tarjetas', 'Título a una línea y descripción a tres, con altura fija para que la cuadrícula no baile.']
];

const COMMENTS = [
  [0, 1, 'Buen resumen, justo lo que buscaba.'],
  [0, 2, '¿La auth admite refresh token o hay que pedirla cada hora?'],
  [1, 3, 'El borde de 4px es el que da el aspecto brutalista.'],
  [1, 4, 'Yo usaría shadow-[6px_6px_0_#172033] para tarjetas grandes.'],
  [2, 5, 'El Ditto por defecto es un clásico.'],
  [2, 6, 'Se puede elegir shiny sin ocupar todo el ancho del formulario.'],
  [3, 7, 'Me pasó exactamente lo mismo con resolveSrv.'],
  [4, 0, 'Fusionar modelos antes que migrar datos, buena decisión.'],
  [4, 5, 'Cuidado con el índice único de email al fusionar.'],
  [5, 8, 'Borrar usuarios por IP me parece Jus.'],
  [5, 9, 'Y ahora no puedes abusar del registro.'],
  [6, 10, 'La cascada evita comentarios huérfanos.'],
  [7, 11, 'Exacto, el body se ignora en el registro público.'],
  [8, 2, 'Verificar contra la base de datos es lo correcto.'],
  [9, 12, 'Base64 engorda el documento, pero así se evita subir archivos.'],
  [10, 13, 'En serverless cada request abre conexión, cuidado con el pool.'],
  [11, 14, 'Con min-h y line-clamp la cuadrícula queda perfecta.']
];

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buffer) {
  let crc = -1;
  for (const byte of buffer) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

function solidPng(width, height, [r, g, b]) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;

  const raw = Buffer.alloc(height * (1 + width * 3));
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (1 + width * 3);
    raw[rowStart] = 0;
    for (let x = 0; x < width; x += 1) {
      const px = rowStart + 1 + x * 3;
      raw[px] = (r + x) % 256;
      raw[px + 1] = (g + y) % 256;
      raw[px + 2] = b;
    }
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

function loadEnv(file) {
  try {
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      const value = match[2].replace(/^["']|["']$/g, '');
      if (!process.env[match[1]]) process.env[match[1]] = value;
    }
  } catch {
    /* .env.local opcional: se respeta lo que ya venga en el entorno */
  }
}

const PALETTE = [
  [255, 203, 5],
  [232, 93, 74],
  [122, 199, 76],
  [42, 108, 203],
  [168, 85, 247]
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Falta MONGODB_URI en .env.local');

  await mongoose.connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 15000 });

  const User = mongoose.model('User', new mongoose.Schema({ email: String, name: String }, { strict: false }));
  const Post = mongoose.model('Post', new mongoose.Schema({}, { strict: false }));
  const Comment = mongoose.model('Comment', new mongoose.Schema({}, { strict: false }));

  const allUsers = await User.find({});
  const byEmail = new Map(allUsers.map((user) => [String(user.email).toLowerCase(), user]));
  const lookup = (email) => byEmail.get(String(email).toLowerCase());

  const missing = [];
  for (const [email] of POSTS) if (!lookup(email)) missing.push(email);
  if (missing.length > 0) {
    throw new Error(`Faltan usuarios de Pec05 en la base: ${[...new Set(missing)].join(', ')}`);
  }

  await Comment.deleteMany({});
  await Post.deleteMany({});
  await User.updateMany({}, { $set: { posts: [], comments: [] } });

  const normalized = [];
  for (const user of allUsers) {
    const lower = String(user.email).toLowerCase();
    if (lower === user.email) continue;
    await User.updateOne({ _id: user._id }, { $set: { email: lower } });
    normalized.push(`${user.email} -> ${lower}`);
  }
  if (normalized.length > 0) {
    console.log('Emails normalizados a minúsculas:');
    for (const line of normalized) console.log(`  ${line}`);
  }

  const createdPosts = [];
  for (const [index, [email, title, description]] of POSTS.entries()) {
    const image = solidPng(160, 100, PALETTE[index % PALETTE.length]).toString('base64');
    const post = await Post.create({ author: lookup(email)._id, title, description, image });
    createdPosts.push(post);
    await User.updateOne({ _id: post.author }, { $push: { posts: post._id } });
  }

  let commentCount = 0;
  for (const [postIndex, userIndex, content] of COMMENTS) {
    const author = lookup(POSTS[postIndex][0]);
    const post = createdPosts[postIndex];
    const comment = await Comment.create({ user: author._id, post: post._id, content });
    await Post.updateOne({ _id: post._id }, { $push: { comments: comment._id } });
    await User.updateOne({ _id: author._id }, { $push: { comments: comment._id } });
    commentCount += 1;
  }

  console.log(`Seed completado sobre ${mongoose.connection.name}`);
  console.log(`  usuarios reutilizados: ${new Set(POSTS.map(([email]) => lookup(email)._id.toString())).size}`);
  console.log(`  posts creados: ${createdPosts.length}`);
  console.log(`  comentarios creados: ${commentCount}`);
}

main()
  .catch((err) => {
    console.error('Seed fallido:', err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });