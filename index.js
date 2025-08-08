// 1. Importa la librer�a Express que instalamos.
const express = require('express');

// 2. Crea una instancia de Express. Es nuestro servidor.
const app = express();

// 3. Define el puerto en el que escuchar� el servidor. 
// El 3000 es un puerto com�n para el desarrollo local.
const PORT = 3000;

// 4. Nuestra "base de datos" simple en memoria. 
// Es un objeto de JavaScript que guarda la informaci�n de los jugadores.
let gameState = {
    "jugador_alfa": {
        "oro": 100
    },
    "jugador_beta": {
        "oro": 150
    }
};

// 5. La l�gica del juego: Se ejecutar� cada minuto (60000 milisegundos).
setInterval(() => {
    // Recorre cada jugador en nuestro gameState.
    for (const jugadorId in gameState) {
        gameState[jugadorId].oro += 10;
        // Imprime un mensaje en la terminal para confirmar que funciona.
        console.log(`+10 de oro para ${jugadorId}. Total: ${gameState[jugadorId].oro}`);
    }
}, 10000); // 60000ms = 1 minuto

// 6. Define una "ruta" o "endpoint". Es como una URL dentro de tu servidor.
// Cuando alguien visite "http://localhost:3000/estado", este c�digo se ejecuta.
app.get('/estado', (req, res) => {
    // Env�a el objeto gameState como una respuesta en formato JSON.
    res.json(gameState);
});

// 7. Arranca el servidor para que empiece a escuchar peticiones.
app.listen(PORT, () => {
    console.log(`Servidor iniciado. Puedes probarlo en http://localhost:${PORT}/estado`);
});