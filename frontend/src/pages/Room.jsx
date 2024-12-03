import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import useSong from '../hook/useSong';
import useRoomById from '../hook/useRoomById';
import Loading from '../components/Loading/Loading';

function Room() {
  const { id: roomId} = useParams();
  const { room, error, loading, socket } = useRoomById(roomId);

  useEffect(() => {
    if (socket) {
      //test envoie un msg
      socket.emit('chatMessage', { roomId, message: 'Hello!' });
    }
  }, [socket, roomId]);
  
  if (loading) return <Loading />;
  if (error) return <div>{error.message}</div>;
  if (!room) return <div>Aucune room trouvée</div>;



  return (
      <>
        <h1>{room.name}</h1>
        <p>id de salle : {room.id}</p>
        <p>joueur en ligne : {room.player}</p>
      </>
  );
};

export default Room;