import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

/**
 * Hook personnalisé pour récupérer les informations d'une salle spécifique par son ID et gérer les connexions Socket.IO
 * @param {string} roomId - L'ID de la salle à récupérer
 * @returns {Object} Un objet contenant les informations de la salle, l'état de chargement, les erreurs éventuelles et la connexion Socket.IO
 * @property {Object|null} room - Informations de la salle récupérée
 * @property {boolean} loading - Indique si le chargement est en cours
 * @property {Error|null} error - Erreur survenue lors de la récupération de la salle
 * @property {SocketIOClient.Socket|null} socket - La connexion Socket.IO
 */
function useRoomById(roomId) {
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const fetchRoom = async () => {
            if (!roomId) {
                setError(new Error("ID de la salle requis"));
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
    
                const response = await axios.get(`http://localhost:3000/room/${roomId}`);
                setRoom(response.data);

                // initialise la connexion Socket.IO
                const newSocket = io('http://localhost:3000');
                setSocket(newSocket);

                // rejoindre la salle
                newSocket.emit('joinRoom', roomId);

                // suivre les mises à jour de la salle
                newSocket.on('roomUpdate', (updatedRoom) => {
                    setRoom(updatedRoom);
                });

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();

        // fermer la connexion Socket.IO lors du démontage
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [roomId]);

    return { room, loading, error, socket };
}

export default useRoomById;