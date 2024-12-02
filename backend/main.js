const cors = require ("cors");
const express = require ("express");
const { initializeApp, cert } = require ("firebase-admin/app");
const { getFirestore } = require ("firebase-admin/firestore");
const serviceAccount = require("./config/serviceAccountKey.json"); // importe le service account credentials de firestore
const { Server } = require("socket.io");
const http = require('http');
const dotenv = require('dotenv')

dotenv.config();
// créer une app express
const app = express();
const PORT = process.env.PORT || 5000;

// créer le serveur websocket
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    }
});

// initialise firebase admin
initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://blindtest-4576c.firebaseio.com"
});

/**
 * config du middleware CORS et des autres middleware
 * ça permet les requêtes depuis http://localhost:5173 et définit des options spécifiques
 */
app.use(cors());
app.use(express.json());

/**
 * Définir une route pour le chemin racine
 * @param {express.Request} req - L'objet de requête
 * @param {express.Response} res - L'objet de réponse
 * @returns {express.Response} Une réponse avec un statut 200 et un message de salutation
 */
app.get('/', (req, res) => {
    console.log(req);
    return res.status(200).send('Bonjour');
});

app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`)
})

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
});
  
// initialiser la base de données Firestore
const db = getFirestore();

// Route test base de donnée
// app.post("/testDB", (req, res) => {
//     let setDoc = 
//     db.collection('testCollection').doc('testDoc').set(req.body); 
//     res.send({'Message': 'Success'});  
//     });