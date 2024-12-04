// On importe les outils nécessaires depuis React :
// - React lui-même pour créer le composant
// - useState pour gérer l'état des variables
// - axios pour faire des requêtes HTTP vers notre serveur
// - useNavigate pour la navigation entre les pages
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

// Définition du composant Register qui gère la page d'inscription
function Register() {
  // Création des variables d'état avec useState :
  // Premier élément : la variable
  // Deuxième élément : la fonction pour modifier cette variable
  const [username, setUsername] = useState('') // Pour le nom d'utilisateur
  const [email, setEmail] = useState('') // Pour l'email
  const [password, setPassword] = useState('') // Pour le mot de passe
  const [created, setCreated] = useState(false) // Pour suivre si le compte est créé
  
  // Hook pour la navigation - permet de rediriger l'utilisateur
  const navigate = useNavigate();

  // Fonction qui s'exécute quand on clique sur le bouton "Créer un compte"
  const handleSaveNewUser = () => {
    // On prépare les données à envoyer au serveur
    const data = {
      username, email, password 
    }
    setCreated(true) // On indique que la création est en cours
    
    // Requête POST vers notre serveur pour créer le compte
    axios.post('http://localhost:3000/auth/register', data)
    .then(() => {
      // Si la création réussit, on redirige vers la page d'accueil
      navigate('/')
    })
    .catch((error) => {
      // Si une erreur survient, on l'affiche dans la console
      console.log(error);  
    })
  }

  return (
      <>
      <div className="loginContainer">
        <h1>Blindtest</h1>
        <div className="loginContainerForm">
           {/* Input onChange
              onChange est déclenché à chaque modification du champ :
              - e est l'événement qui contient les informations de ce qui vient de se passer
              - e.target est l'input HTML lui-même
              - e.target.value est la nouvelle valeur tapée par l'utilisateur
              - setUsername met à jour l'état 'username' avec cette nouvelle valeur */}
          <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="email" placeholder="Adresse mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleSaveNewUser} className="loginContainerFormButton">Créer un compte</button>
          <p>Tu as déjà un compte ? <a href="login">Connecte toi</a></p>
        </div>
      </div>
      </>
  );
};

export default Register;