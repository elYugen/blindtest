import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import { PORT } from "./config/config.js";

// Import config bdd
import db from "./config/firebaseConfig.js";

// Import des différentes routes
import songRoutes from "./routes/songRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";

/**
 * Crée une application Express
 * @type {express.Application}
 */
const app = express();
const port = process.env.PORT || 5000;

/**
 * Crée un serveur HTTP à partir de l'application Express
 * @type {http.Server}
 */
const server = http.createServer(app);

/**
 * Configure et initialise Socket.IO
 * @type {SocketIO.Server}
 */
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    }
});

// Configuration des middlewares
app.use(cors({
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
}));
app.use(express.json());

/**
 * Route pour le chemin racine
 * @param {express.Request} req - L'objet de requête
 * @param {express.Response} res - L'objet de réponse
 * @returns {express.Response} Une réponse avec un statut 200 et un message
 */
app.get('/', (req, res) => {
    console.log(req);
    return res.status(200).send('Bonjour');
});

// Démarre le serveur avec le port spécifié
server.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`)
});

// Gère les connexion socket.io
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room ${roomId}`);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Routes de l'application
app.use('/song', songRoutes);
app.use('/room', roomRoutes);


/**
 * Route de test pour la base de données
 * @param {express.Request} req - L'objet de requête
 * @param {express.Response} res - L'objet de réponse
 */
app.post("/testDB", (req, res) => {
    let setDoc = 
    db.collection('testCollection').doc('testDoc').set(req.body); 
    res.send({'Message': 'Success'});  
});