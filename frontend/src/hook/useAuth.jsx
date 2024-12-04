/************************************/
/*          IMPORTATIONS            */
/************************************/
// Hooks React nécessaires
import { useState, useEffect, createContext, useContext } from 'react';
// useState : pour gérer l'état local
// useEffect : pour les effets secondaires (appels API)
// createContext : pour créer le contexte d'authentification
// useContext : pour utiliser le contexte ailleurs dans l'application

// Axios pour les requêtes HTTP
import axios from 'axios';

/************************************/
/*     CRÉATION DU CONTEXTE         */
/************************************/
// Création d'un contexte React pour partager l'état d'authentification
// La valeur initiale est null
const AuthContext = createContext(null);

/************************************/
/*     PROVIDER D'AUTHENTIFICATION  */
/************************************/
// Composant qui va envelopper notre application et fournir les fonctionnalités d'authentification
// {children} représente tous les composants enfants qui seront enveloppés
export const AuthProvider = ({ children }) => {
  // États locaux
  const [user, setUser] = useState(null);           // Stocke les informations de l'utilisateur connecté
  const [loading, setLoading] = useState(true);     // Indique si une opération est en cours
  const [error, setError] = useState(null);         // Stocke les messages d'erreur

  // Configuration globale d'Axios
  axios.defaults.withCredentials = true;            // Permet l'envoi automatique des cookies
  axios.defaults.baseURL = 'http://localhost:3000'; // URL de base de notre API

  /************************************/
  /*     FONCTIONS D'AUTHENTIFICATION */
  /************************************/
  
  // Fonction pour récupérer les informations de l'utilisateur connecté
  const fetchUserInfo = async () => {
    try {
      // Appel à l'API pour récupérer les infos utilisateur
      const response = await axios.get('/auth/me');
      console.log(response.data); // Log les infos de l'utilisateur
      setUser(response.data);        // Met à jour l'état avec les données utilisateur
      setError(null);                // Réinitialise les erreurs
    } catch (error) {
      console.error(error);
      // Si l'erreur est 401 (non authentifié), on réinitialise l'utilisateur
      if (error.response && error.response.status === 401) {
        setUser(null);
      } else {
        setError('Erreur lors de la récupération des informations utilisateur');
      }
    } finally {
      setLoading(false);             // Indique que le chargement est terminé
    }
  };

  // Fonction de connexion
  const login = async ({ email, password }) => {
    try {
      // Appel à l'API de connexion
      const response = await axios.post('/auth/login', { email, password });
      await fetchUserInfo();  // Cette fonction mettra à jour user avec toutes les infos
      setError(null);                // Réinitialise les erreurs
      console.log("Utilisateur connecté :", response.data);
    } catch (err) {
      // Gestion des erreurs avec message personnalisé
      setError(err.response?.data.message || 'Erreur de connexion');
      console.error("Erreur de connexion :", err);
      throw err;                     // Propage l'erreur pour la gestion dans les composants
    }
  };

  // Fonction d'inscription
  const register = async ({ username, email, password }) => {
    try {
      // Création du compte
      await axios.post('/auth/register', { username, email, password });
      // Connexion automatique après inscription
      await login({ email, password });
    } catch (err) {
      setError(err.response?.data.message || 'Erreur lors de l\'inscription');
      throw err;
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      // Appel à l'API de déconnexion
      await axios.post('/auth/logout');
      setUser(null);                 // Réinitialise l'utilisateur
    } catch (err) {
      setError('Erreur lors de la déconnexion');
    }
  };

  /************************************/
  /*     EFFET AU CHARGEMENT         */
  /************************************/
  // Vérifie l'état d'authentification au chargement de l'application
  useEffect(() => {
    fetchUserInfo();
  }, []); // Le tableau vide signifie que cet effet ne s'exécute qu'une fois au montage

  /************************************/
  /*     RENDU DU PROVIDER           */
  /************************************/
  // Fournit le contexte d'authentification à tous les composants enfants
  return (
    <AuthContext.Provider value={{
      user,         // État de l'utilisateur connecté
      loading,      // État de chargement
      error,        // Messages d'erreur
      login,        // Fonction de connexion
      logout,       // Fonction de déconnexion
      register,     // Fonction d'inscription
      fetchUserInfo // Fonction de récupération des infos utilisateur
    }}>
      {children}
    </AuthContext.Provider>
  );
};

/************************************/
/*     HOOK PERSONNALISÉ            */
/************************************/
// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  // Vérifie que le hook est utilisé dans un composant enfant de AuthProvider
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};