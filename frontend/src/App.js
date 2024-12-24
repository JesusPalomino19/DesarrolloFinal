import React, { useState, useEffect } from 'react';
import { fetchRooms, reserveRoom, payRoom, updateRoomState } from './services/api';
import './App.css'; // Ensure to import the CSS file

function App() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const loadRooms = async () => {
      const roomsData = await fetchRooms();
      setRooms(roomsData);
    };
    loadRooms();
  }, []);

  const handleReserve = async (id) => {
    const result = await reserveRoom(id);
    alert(result);
    setRooms(await fetchRooms());
  };

  const handlePay = async (id) => {
    const result = await payRoom(id);
    alert(result);
    setRooms(await fetchRooms());
  };

  const handleReset = async (id) => {
    const result = await updateRoomState(id, 'disponible');
    alert(result);
    setRooms(await fetchRooms());
  };

  return (
    <div className="app-container">
      <div className="module">
        <h1>Booking.com</h1>
        <div className="room-list">
          {rooms.map(room => (
            <div key={room.id} className="room-row">
              <p>{`Room ${room.id} - Status: ${room.estado}`}</p>
              <button onClick={() => handleReserve(room.id)} disabled={room.estado !== 'disponible'}>
                Reserve
              </button>
              <button onClick={() => handlePay(room.id)} disabled={room.estado !== 'reservada'}>
                Pay
              </button>
              {room.estado === 'pagada' && (
                <button onClick={() => handleReset(room.id)}>
                  Reset to Available
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;