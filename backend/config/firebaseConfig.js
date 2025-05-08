import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

// Initialiser Firebase
initializeApp({
    credential: cert(serviceAccount),
    databaseURL: ""
});

// Exporter Firestore
const db = getFirestore();

export default db;
