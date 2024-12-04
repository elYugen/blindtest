// importe le module 'dotenv' qui permet de charger les variables d'environnement contenu dans le .env
import dotenv from 'dotenv';

// charge les variables d'environnement depuis le fichier .env
// les variables seront accessibles via process.env
dotenv.config();

// exporte la variable PORT qui est contenu dans le fichier .env
export const PORT = process.env.PORT;

export const SPOTIFYSECRET = process.env.SPOTIFYSECRET
export const SPOTIFYCLIENT = process.env.SPOTIFYCLIENT