import express from "express";
import db from "../config/firebaseConfig.js";
import axios from "axios";
import { SPOTIFYCLIENT, SPOTIFYSECRET } from "../config/config.js";

const router = express.Router();

// Fonction pour obtenir un token d'accès Spotify
async function getSpotifyAccessToken() {
    const clientId = process.env.SPOTIFYCLIENT;
    const clientSecret = process.env.SPOTIFYSECRET;

    const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({ grant_type: "client_credentials" }),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
            },
        }
    );

    return response.data.access_token;
}

/**
 * Route pour ajouter une nouvelle playlist en récupérant des morceaux depuis l'API Spotify
 * @route POST /add-playlist-from-spotify
 */
router.post("/add-playlist-from-spotify", async (req, res) => {
    try {
        const { spotifyPlaylistId } = req.body;

        if (!spotifyPlaylistId) {
            return res.status(400).send({ error: "L'ID de la playlist Spotify est requis." });
        }

        // Obtenir un token d'accès Spotify
        const accessToken = await getSpotifyAccessToken();

        // Récupérer les morceaux de la playlist Spotify
        const response = await axios.get(
            `https://api.spotify.com/v1/playlists/${spotifyPlaylistId}/tracks`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        const tracks = response.data.items.map((item) => ({
            name: item.track.name,
            artist: item.track.artists[0].name,
            preview_url: item.track.preview_url, // URL pour préécouter la musique
        }));

        // Créer un objet playlist pour Firestore
        const playlist = {
            title: `Spotify Playlist - ${spotifyPlaylistId}`,
            tracks: tracks,
            createdAt: new Date().toISOString(),
        };

        // Ajouter la playlist dans Firestore
        const docRef = await db.collection("playlists").add(playlist);

        res.status(201).send({ message: "Playlist ajoutée avec succès depuis Spotify", id: docRef.id });
    } catch (error) {
        res.status(500).send({ error: "Erreur lors de l'ajout de la playlist", details: error.message });
    }
});

/**
 * Route pour récupérer toutes les playlists
 * @route GET /playlists
 */
router.get("/get-playlists", async (req, res) => {
    try {
        const snapshot = await db.collection("playlists").get();

        const playlists = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).send(playlists);
    } catch (error) {
        res.status(500).send({ error: "Erreur lors de la récupération des playlists", details: error.message });
    }
});

/**
 * Route pour récupérer une playlist par son ID
 * @route GET /:playlistId
 */
router.get("/:playlistId", async (req, res) => {
    try {
        const { playlistId } = req.params;

        if (!playlistId) {
            return res.status(400).send({ error: "L'ID de la playlist est requis." });
        }

        // Récupérer la playlist depuis Firestore
        const docRef = await db.collection("playlists").doc(playlistId).get();

        if (!docRef.exists) {
            return res.status(404).send({ error: "Playlist introuvable." });
        }

        const playlist = { id: docRef.id, ...docRef.data() };

        res.status(200).send(playlist);
    } catch (error) {
        res.status(500).send({ error: "Erreur lors de la récupération de la playlist", details: error.message });
    }
});


export default router;
