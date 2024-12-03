import express from "express"
import db from "../config/firebaseConfig.js";

// créer un router pour gérer toutes les routes lié aux salles
const router = express.Router();

/**
 * Route pour ajouter une nouvelle salle
 * @route POST /add-room
 * @param {express.Request} req - l'objet de requête Express
 * @param {express.Response} res - l'objet de réponse Express
 * @param {Object} req.body - les données de la salle à créer
 * @returns {Object} message de succès et ID du document créé
 * @throws {Object} message d'erreur en cas d'échec
 */
router.post("/add-room", async (req, res) => {
    try {
        // récupérer les données de la salles depuis le corps de la requête
        const roomData = req.body;
        // créer un objet javascript contenant les informations à ajouter dans la collection
        const room = {
            name: roomData.name,
            player: roomData.player,
            currentSong: roomData.currentSong,
            status: roomData.status
        };
        // ajouter la nouvelle chanson à la collection "rooms" dans Firestore
        const docRef = await db.collection("rooms").add(room);
        // renvoie une réponse de succès avec l'ID du document créé
        res.status(201).send({ message: "salle créée avec succès", id: docRef.id });
    } catch (error) {
        // en cas d'erreur, envoyer une réponse d'erreur
        res.status(400).send({ error: error.message });
    }
});


/**
 * Route pour récupérer toutes les salles
 * @route GET /get-room
 * @param {express.Request} req - l'objet de requête Express
 * @param {express.Response} res - l'objet de réponse Express
 * @returns {Object[]} un tableau contenant toutes les salles
 * @throws {Object} message d'erreur en cas d'échec
 */
router.get("/get-room", async (req, res) => {
    try {
        // Récupérer tous les documents de la collection "rooms"
        const snapshot = await db.collection("rooms").get();
        
        // Transformer les documents en un tableau d'objets
        const rooms = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                player: data.player,
                currentSong: data.currentSong,
                status: data.status
            };
        });
        
        // Envoyer le tableau de salles en réponse
        res.status(200).send(rooms);
    } catch (error) {
        // En cas d'erreur, envoyer une réponse d'erreur
        res.status(500).send({ error: "Erreur lors de la récupération des salles", details: error.message });
    }
});


/**
 * Route pour récupérer une salle par son ID
 * @route GET /:id
 * @param {express.Request} req - l'objet de requête Express
 * @param {express.Response} res - l'objet de réponse Express
 * @returns {Object} Les détails de la salle demandée
 * @throws {Object} Message d'erreur en cas d'échec
 */
router.get('/:id', async (req, res) => {
    try {
        const roomId = req.params.id;
        
        // Récupérer le document de la salle avec l'ID spécifié
        const roomDoc = await db.collection("rooms").doc(roomId).get();

        // Vérifier si la salle existe
        if (!roomDoc.exists) {
            return res.status(404).send({ error: "Salle non trouvée" });
        }

        // Récupérer les données de la salle
        const roomData = roomDoc.data();
        
        // Créer l'objet de réponse avec l'ID et les données de la salle
        const room = {
            id: roomDoc.id,
            name: roomData.name,
            player: roomData.player,
            currentSong: roomData.currentSong,
            status: roomData.status
        };

        // Envoyer les détails de la salle en réponse
        res.status(200).send(room);
    } catch (error) {
        res.status(500).send({ error: "Erreur lors de la récupération de la salle", details: error.message });
    }
});


export default router;