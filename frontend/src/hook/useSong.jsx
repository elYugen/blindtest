import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Hook personnalisé pour récupérer la liste des chansons depuis l'API
 * @returns {Object} Un objet contenant les chansons, l'état de chargement et les erreurs éventuelles
 * @property {Array} songs - Liste des chansons récupérées
 * @property {boolean} loading - Indique si le chargement est en cours
 * @property {Error|null} error - Erreur survenue lors de la récupération des chansons
 */
function useSong() {
    /**
     * État pour stocker la liste des chansons
     * @type {Array}
     */
    const [songs, setSongs] = useState([]);

    /**
     * État pour gérer le chargement des données
     * @type {boolean}
     */
    const [loading, setLoading] = useState(true);

    /**
     * État pour stocker les erreurs éventuelles
     * @type {Error|null}
     */
    const [error, setError] = useState(null);

    /**
     * Effet pour récupérer les chansons au montage du composant
     */
    useEffect(() => {
        /**
         * Fonction asynchrone pour récupérer les chansons depuis l'API
         */
        const fetchSongs = async () => {
            try {
                // Réinitialiser l'état de chargement et d'erreur
                setLoading(true);
                setError(null);
    
                // Requête pour récupérer les chansons
                const response = await axios.get('http://localhost:3000/song/get-song');
                
                // Mettre à jour l'état avec les chansons récupérées
                setSongs(response.data);
            } catch (err) {
                // Gérer les erreurs de récupération
                setError(err);
            } finally {
                // Indiquer que le chargement est terminé
                setLoading(false);
            }
        };

        // Appeler la fonction de récupération
        fetchSongs();
    }, []); // Tableau de dépendances vide pour n'exécuter qu'une seule fois

    // Retourner les états pour utilisation dans les composants
    return { songs, loading, error };
}

export default useSong;