import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hook/useAuth'; 
import Loading from '../Loading/Loading'; 
import './Navbar.css';

function Navbar() {
  const { user, loading, error, fetchUserInfo } = useAuth();

      // Effet pour recharger les infos utilisateur au montage du composant
      useEffect(() => {
        if (!user) {
          fetchUserInfo();
        }
      }, [fetchUserInfo]);
  
    // Si le chargement est en cours, retourner null (ou un composant de chargement)
    if (loading) {
      return <Loading/>;
    }
  
    // S'il y a une erreur, on l'affiche
    if (error) {
      return <div>Erreur: {error}</div>;
    }

  return (
    <div className="Navbar">
      {user ? (
        <h1>{user.username}</h1>
      ) : (
        <h1>Vous n'êtes pas connecté <a href="/login">co toi</a></h1>
      )}
    </div>
  );
};

export default Navbar;