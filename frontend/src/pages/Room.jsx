import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useAuth } from '../hook/useAuth';
import useRoomById from '../hook/useRoomById';
import Loading from '../components/Loading/Loading';
import Navbar from '../components/Navbar/Navbar'
import Game from '../components/Game/Game';

function Room() {
  const { id: roomId } = useParams();
  const { user, fetchUserInfo } = useAuth();
  const { room, error, loading, socket } = useRoomById(roomId);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    if (socket && roomId) {
      socket.emit('joinRoom', roomId, user?.username);
  
      const handleMessage = (msg) => {
        setChatMessages((prevMessages) => [...prevMessages, msg]);
      };
  
      socket.on('chat message', handleMessage);
  
      return () => {
        socket.off('chat message', handleMessage);
      };
    }
  }, [socket, roomId, user?.username]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      console.log('Message envoyé:', message);
      socket.emit('chat message', { message: message });
      setMessage(''); 
    }
  };

  if (loading) return <Loading />;
  if (error) return <div>{error.message}</div>;
  if (!room) return <div>Aucune room trouvée</div>;

  return (
    <>
    <Navbar />
    <Game/>
      <h1>{room.name}</h1>
      <p>id de salle : {room.id}</p>
      <p>joueur en ligne : {room.player}</p>

      <ul id="messages">
        {chatMessages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.username}:</strong> {msg.message.message}
          </li>
        ))}
      </ul>

      <form id="form" onSubmit={handleSubmit}>
        <input id="input" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default Room;