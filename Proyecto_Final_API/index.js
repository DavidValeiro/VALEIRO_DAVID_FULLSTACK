require("dotenv").config();
const MONGODB_URI = process.env.MONGODB_URI;
const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB(MONGODB_URI).catch((err) =>
    console.error("Error de conexión a MongoDB:", err.message)
);      

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
}

console.log("Servidor iniciado. Esperando solicitudes...");