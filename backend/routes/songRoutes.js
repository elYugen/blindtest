import express from "express"
import Song from "../models/songModel.js";
import db from "../config/firebaseConfig.js";

// créer un router pour gérer toutes les routes lié aux sons
const router = express.Router();

/**
 * Route pour ajouter une nouvelle chanson
 * @route POST /add-song
 * @param {express.Request} req - l'objet de requête Express
 * @param {express.Response} res - l'objet de réponse Express
 * @param {Object} req.body - les données de la chanson à ajouter
 * @returns {Object} message de succès et ID du document créé
 * @throws {Object} message d'erreur en cas d'échec
 */
router.post("/add-song", async (req, res) => {
    try {
        // récupérer les données de la chanson depuis le corps de la requête
        const songData = req.body;
        // créer un objet javascript contenant les informations à ajouter dans la collection
        const song = {
            title: songData.title,
            artist: songData.artist,
            duration: songData.duration,
            createdAt: new Date().toISOString() 
        };
        // ajouter la nouvelle chanson à la collection "songs" dans Firestore
        const docRef = await db.collection("songs").add(song);
        // renvoie une réponse de succès avec l'ID du document créé
        res.status(201).send({ message: "chanson ajouté avec succès", id: docRef.id });
    } catch (error) {
        // en cas d'erreur, envoyer une réponse d'erreur
        res.status(400).send({ error: error.message });
    }
});


/**
 * Route pour récupérer toutes les chansons
 * @route GET /songs
 * @param {express.Request} req - l'objet de requête Express
 * @param {express.Response} res - l'objet de réponse Express
 * @returns {Object[]} un tableau contenant toutes les chansons
 * @throws {Object} message d'erreur en cas d'échec
 */
router.get("/get-song", async (req, res) => {
    try {
        // Récupérer tous les documents de la collection "songs"
        const snapshot = await db.collection("songs").get();
        
        // Transformer les documents en un tableau d'objets
        const songs = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                artist: data.artist,
                duration: data.duration,
                createdAt: data.createdAt
            };
        });
        
        // Envoyer le tableau de chansons en réponse
        res.status(200).send(songs);
    } catch (error) {
        // En cas d'erreur, envoyer une réponse d'erreur
        res.status(500).send({ error: "Erreur lors de la récupération des chansons", details: error.message });
    }
});
export default router;