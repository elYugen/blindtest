import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import http from "http";
import { PORT } from "./config/config.js";
import session from "express-session";

// Import config bdd
import db from "./config/firebaseConfig.js";

// Import des différentes routes
import songRoutes from "./routes/songRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";

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
        credentials: true, // Autorise les cookies/sessions partagés
    },
});

// Configuration du système de session
app.use(session({
    // Clé secrète utilisée pour signer le cookie de session
    secret: '7hv0U2!-rr+uW~e$;2nC,4<9<iK9tFDqjlXDNbE[%bdFD7]AsY}&3ed77)*^;Wk',
    
    // Options de session
    resave: false,                // Ne pas sauvegarder la session si elle n'est pas modifiée
    saveUninitialized: false,     // Ne pas créer de session tant qu'il n'y a rien à stocker

    // Configuration du stockage des sessions dans la mémoire
    store: new session.MemoryStore(),

    // Configuration du cookie de session
    cookie: {
        secure: false,      // false car nous n'utilisons pas HTTPS en développement
        httpOnly: true,     // Empêche l'accès au cookie via JavaScript (sécurité)
        maxAge: 1000 * 60 * 60 * 24  // Durée de vie du cookie : 24 heures en millisecondes
    }
}));

// Configuration des middlewares
app.use(cors({
    origin: "http://localhost:5173", // Origine autorisée
    methods: ["GET", "POST", "PUT", "DELETE"], // Méthodes HTTP autorisées
    credentials: true, // Autorise les cookies/sessions partagés
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

io.on('connection', (socket) => {
    console.log('a user connected');

    // gere l'utilisateurqui rej une salle
    socket.on('joinRoom', (roomId, username) => {
        socket.join(roomId);
        console.log(`${username} joined room ${roomId}`);
        socket.username = username || 'Anonyme'; 
        socket.roomId = roomId; 
    });

    // gere les message
    socket.on('chat message', (msg) => {
        const messageData = {
            username: socket.username || 'Anonyme',
            message: msg, 
        };

        // envoie le message dans la salle de l'utilisateur
        io.to(socket.roomId).emit('chat message', messageData);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Routes de l'application
app.use('/song', songRoutes);
app.use('/room', roomRoutes);
app.use('/auth', authRoutes);
app.use('/playlist', playlistRoutes);

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
