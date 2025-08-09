const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

// ⚠️ ACÁ TENÉS QUE PEGAR TU CADENA DE CONEXIÓN REAL CON LA CONTRASEÑA
const uri = "mongodb+srv://fototonico:E74QDF0TrfOwSk58@cluster0.imtxxjd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Nombres para tu base de datos y tu colección (la tabla)
const DB_NAME = "mi_juego";
const COLLECTION_NAME = "gameState";

let dbClient; // Esto va a guardar la conexión a la base de datos
let gameState = {}; // Esto guardará el estado del juego en memoria

// Esta función carga el estado del juego desde la base de datos
async function cargarEstado() {
    try {
        const collection = dbClient.db(DB_NAME).collection(COLLECTION_NAME);
        const estadoGuardado = await collection.findOne({}); // Busca el estado guardado
        if (estadoGuardado && estadoGuardado.data) {
            gameState = estadoGuardado.data;
            console.log("Estado cargado desde la base de datos.");
        } else {
            // Si no hay estado guardado, crea uno por defecto
            gameState = {
                "jugador_alfa": { "oro": 100 },
                "jugador_beta": { "oro": 150 }
            };
            // Y lo guarda por primera vez en la base de datos
            await collection.insertOne({ data: gameState });
            console.log("Estado inicial creado y guardado en la base de datos.");
        }
    } catch (err) {
        console.error("Error al cargar el estado desde MongoDB:", err);
    }
}

// Esta función guarda el estado del juego en la base de datos
async function guardarEstado() {
    try {
        const collection = dbClient.db(DB_NAME).collection(COLLECTION_NAME);
        // Actualiza el documento con el nuevo estado del juego
        await collection.updateOne({}, { $set: { data: gameState } }, { upsert: true });
        console.log("Estado guardado en la base de datos.");
    } catch (err) {
        console.error("Error al guardar el estado en MongoDB:", err);
    }
}

// Función principal que inicia todo
async function startServer() {
    try {
        // Conecta con la base de datos de MongoDB Atlas
        dbClient = new MongoClient(uri);
        await dbClient.connect();
        console.log("Conectado correctamente a MongoDB Atlas.");

        // Carga el estado inicial o guardado
        await cargarEstado();

        // Lógica del juego: suma oro cada 10 segundos y lo guarda
        setInterval(async () => {
            for (const jugadorId in gameState) {
                gameState[jugadorId].oro += 10;
                console.log(`+10 de oro para ${jugadorId}. Total: ${gameState[jugadorId].oro}`);
            }
            await guardarEstado(); // Llama a la función para guardar el estado
        }, 10000);

        // Ruta para mostrar el estado del juego
        app.get('/estado', (req, res) => {
            res.json(gameState);
        });

        // Inicia el servidor de Express
        app.listen(PORT, () => {
            console.log(`Servidor iniciado y escuchando en http://localhost:${PORT}/estado`);
        });

    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
    }
}

startServer(); // Llama a la función para arrancar todo