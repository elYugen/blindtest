import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Hook personnalisé pour récupérer la liste des salles depuis l'API
 * @returns {Object} Un objet contenant les salles, l'état de chargement et les erreurs éventuelles
 * @property {Array} songs - Liste des salles récupérées
 * @property {boolean} loading - Indique si le chargement est en cours
 * @property {Error|null} error - Erreur survenue lors de la récupération des salles
 */
function useRoom() {
    /**
     * État pour stocker la liste des salles
     * @type {Array}
     */
    const [rooms, setRooms] = useState([]);

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
     * Effet pour récupérer les salles au montage du composant
     */
    useEffect(() => {
        /**
         * Fonction asynchrone pour récupérer les salles depuis l'API
         */
        const fetchRooms = async () => {
            try {
                // Réinitialiser l'état de chargement et d'erreur
                setLoading(true);
                setError(null);
    
                // Requête pour récupérer les salles
                const response = await axios.get('http://localhost:3000/room/get-room');
                
                // Mettre à jour l'état avec les salles récupérées
                setRooms(response.data);
            } catch (err) {
                // Gérer les erreurs de récupération
                setError(err);
            } finally {
                // Indiquer que le chargement est terminé
                setLoading(false);
            }
        };

        // Appeler la fonction de récupération
        fetchRooms();
    }, []); // Tableau de dépendances vide pour n'exécuter qu'une seule fois

    // Retourner les états pour utilisation dans les composants
    return { rooms, loading, error };
}

export default useRoom;