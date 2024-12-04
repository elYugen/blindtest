// Dépendances React
import React, { useState } from 'react'  // React et hook useState pour gérer l'état du formulaire
import { useNavigate } from 'react-router-dom'  // Hook pour la navigation programmatique
import { useAuth } from '../hook/useAuth'       // Hook personnalisé pour l'authentification

/************************************/
/*     COMPOSANT LOGIN             */
/************************************/
function Login() {
  /************************************/
  /*     HOOKS ET ÉTATS              */
  /************************************/
  // Récupération des fonctionnalités d'authentification
  const { login, error } = useAuth();  // login: fonction de connexion, error: message d'erreur éventuel
  
  // États locaux pour les champs du formulaire
  const [email, setEmail] = useState('')        // État pour l'email
  const [password, setPassword] = useState('')  // État pour le mot de passe
  
  // Hook de navigation
  const navigate = useNavigate();  // Permet de rediriger l'utilisateur après connexion

  
  /************************************/
  /*     GESTIONNAIRE D'ÉVÉNEMENTS   */
  /************************************/
  /**
   * Gère la soumission du formulaire de connexion
   */
  const handleSubmit = async (e) => {
    e.preventDefault();  // Empêche le rechargement de la page
    
    try {
      // Tentative de connexion avec les identifiants saisis
      await login({ email, password });
      
      // Si la connexion réussit, redirection vers la page d'accueil
      navigate('/');
    } catch (err) {
      // En cas d'erreur, affichage dans la console
      console.error(err);
      // Note: L'erreur est déjà gérée par le contexte d'authentification
      // et stockée dans la variable 'error'
    }
  };

  return (
      <>
      <div className="loginContainer">
        <h1>Blindtest</h1>
        <form className="loginContainerForm" onSubmit={handleSubmit}>
          <input type="email" placeholder="Adresse mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="loginContainerFormButton">Connexion</button>
          <p>Tu n'as pas de compte ? <a href="register">Inscris toi</a></p>
        </form>
      </div>
      </>
  );
};

export default Login;