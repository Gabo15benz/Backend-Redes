

import express from "express";
import pkg from "pg";
import cors from "cors";
import "dotenv/config";

const { Pool } = pkg;
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// conexión a Neon
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// comprobar conexión
app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({
            status: "ok",
            time: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// registro de usuario
app.post("/registro", async (req, res) => {
    const { nombre, correo, password } = req.body;

    try {
        await pool.query(
            `INSERT INTO usuarios (nombre, correo, password)
             VALUES ($1, $2, $3)`,
            [nombre, correo, password]
        );

        res.json({ ok: true });
    } catch (err) {
        res.status(400).json({
            ok: false,
            error: "Correo ya registrado"
        });
    }
});

// iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor activo en:${PORT}`);
});

