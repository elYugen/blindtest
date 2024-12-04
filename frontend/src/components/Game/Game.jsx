import { useState, useEffect } from "react";
import axios from "axios";

function Game() {
  const [currentTrack, setCurrentTrack] = useState(null); // Track actuel
  const [userInput, setUserInput] = useState(''); // Réponse de l'utilisateur
  const [isCorrect, setIsCorrect] = useState(null); // État de la réponse
  const [loading, setLoading] = useState(true); // État du chargement

  useEffect(() => {
    // Charger une musique aléatoire depuis l'API
    fetchRandomTrack();
  }, []);

  const fetchRandomTrack = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/playlist/aJt0RDc33hL2DGtZboCF');
      const { tracks } = response.data;

      if (tracks && tracks.length > 0) {
        // Sélectionner une musique aléatoire
        const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
        setCurrentTrack(randomTrack);
      } else {
        console.warn("Aucune musique disponible dans la playlist.");
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la musique :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentTrack && userInput.trim().toLowerCase() === currentTrack.name.trim().toLowerCase()) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <h1>Devine la musique 🎵</h1>
      {currentTrack ? (
        <>
          {/* Debug: Affiche le nom de la musique et l'artiste */}
          <p>Nom (debug) : {currentTrack.name}</p>
          <p>Artiste (debug) : {currentTrack.artist}</p>

          {/* Audio player désactivé si preview_url est null */}
          {currentTrack.preview_url ? (
            <audio controls src={currentTrack.preview_url}></audio>
          ) : (
            <p>Aucun extrait disponible pour cette musique.</p>
          )}

          {/* Formulaire pour deviner */}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Nom de la musique"
            />
            <button type="submit">Valider</button>
          </form>

          {/* Message de résultat */}
          {isCorrect !== null && (
            <p style={{ color: isCorrect ? "green" : "red" }}>
              {isCorrect ? "🎉 Bonne réponse !" : "❌ Essaie encore."}
            </p>
          )}

          {/* Bouton pour changer de musique */}
          <button onClick={fetchRandomTrack}>Nouvelle musique</button>
        </>
      ) : (
        <p>Aucune musique trouvée.</p>
      )}
    </div>
  );
}

export default Game;
