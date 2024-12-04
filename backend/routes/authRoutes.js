import express from "express";
import bcrypt from "bcryptjs";
import db from "../config/firebaseConfig.js";

const router = express.Router();

/**
 * Route pour l'inscription d'un nouvel utilisateur
 * @route POST /register
 * @param {express.Request} req - L'objet de requête Express
 * @param {express.Response} res - L'objet de réponse Express
 */
router.post("/register", async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            return res.status(400).send({ message: "Veuillez fournir tous les champs" });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Photo de profil par défaut
        const defaultProfilePicture = "https://example.com/default-profile-picture.png";

        // Création de l'utilisateur
        const user = {
            username,
            password: hashedPassword,
            email,
            profilePicture: defaultProfilePicture,
            createdAt: new Date().toISOString(),
        };

        // Ajout de l'utilisateur dans Firestore
        const docRef = await db.collection("users").add(user);

        res.status(201).send({ message: "Utilisateur enregistré avec succès", id: docRef.id });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).send({ message: "Erreur lors de l'inscription", error: error.message });
    }
});

/**
 * Route pour la connexion d'un utilisateur
 * @route POST /login
 * @param {express.Request} req - L'objet de requête Express
 * @param {express.Response} res - L'objet de réponse Express
 */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: "Email et mot de passe requis" });
        }

        // Recherche de l'utilisateur par email
        const snapshot = await db.collection("users").where("email", "==", email).get();

        if (snapshot.empty) {
            return res.status(401).send({ message: "Utilisateur non trouvé" });
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        // Vérification du mot de passe
        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(401).send({ message: "Mot de passe incorrect" });
        }

        // Création de la session utilisateur
        req.session.userId = userDoc.id;
        req.session.email = userData.email;

        // Renvoi des informations utilisateur sans mot de passe
        res.status(200).send({
            id: userDoc.id,
            username: userData.username,
            email: userData.email,
        });
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).send({ message: "Erreur lors de la connexion", error: error.message });
    }
});

/**
 * Route pour récupérer les informations de l'utilisateur connecté
 * @route GET /me
 * @param {express.Request} req - L'objet de requête Express
 * @param {express.Response} res - L'objet de réponse Express
 */
router.get("/me", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send({ message: "Non authentifié" });
    }

    try {
        const userDoc = await db.collection("users").doc(req.session.userId).get();

        if (!userDoc.exists) {
            return res.status(404).send({ message: "Utilisateur non trouvé" });
        }

        const userData = userDoc.data();

        res.status(200).send({
            id: userDoc.id,
            username: userData.username,
            email: userData.email,
            profilePicture: userData.profilePicture,
            createdAt: userData.createdAt,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        res.status(500).send({ message: "Erreur lors de la récupération de l'utilisateur", error: error.message });
    }
});

/**
 * Route pour la déconnexion
 * @route POST /logout
 * @param {express.Request} req - L'objet de requête Express
 * @param {express.Response} res - L'objet de réponse Express
 */
router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Erreur lors de la déconnexion :", err);
            return res.status(500).send({ message: "Erreur lors de la déconnexion" });
        }
        res.status(200).send({ message: "Déconnecté avec succès" });
    });
});

export default router;
