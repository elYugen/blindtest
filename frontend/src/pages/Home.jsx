import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import useSong from '../hook/useSong';
import useRoom from '../hook/useRoom';
import { useAuth } from '../hook/useAuth';
import Loading from '../components/Loading/Loading'
import Navbar from '../components/Navbar/Navbar';

function Home() {
    const {songs, loading, error} = useSong();
    const {rooms} = useRoom();
    const { 
        user,     // Informations de l'utilisateur connecté
        login,    // Fonction de connexion
        logout    // Fonction de déconnexion 
      } = useAuth();
    const navigate = useNavigate();
    
    if (loading) return <Loading/>;
    if (error) return <div>{error}</div>

    return (
        <>
        <Navbar/>
        <h1>Liste des sons</h1>
        {songs.map((song) => (
            <div key={song.id}>
                <h2>{song.title}</h2>
                <p>{song.artist}</p>
                <p>{song.duration}</p>
            </div>
        ))}

        {rooms.map((room) => (
            <div key={room.id}>
                <h2>{room.name}</h2>
                <p>Son en cours : {room.currentSong}</p>
                <p>Statut : {room.status}</p>
                <p>Joueur : {room.player}</p>
                <button onClick={() => navigate(`/room/${room.id}`)}>Rejoindre la salle →	</button>
            </div>
        ))}
        </>
    );
};

export default Home;