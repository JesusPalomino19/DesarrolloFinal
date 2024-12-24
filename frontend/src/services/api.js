const API_URL = 'http://localhost:4000/api/rooms';

export const fetchRooms = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error('Error fetching rooms:', err);
    return [];
  }
};

export const reserveRoom = async (id) => {
  const response = await fetch(`${API_URL}/reserve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  return response.ok ? `Room ${id} reserved successfully` : await response.text();
};

export const payRoom = async (id) => {
  const response = await fetch(`${API_URL}/pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  return response.ok ? `Room ${id} paid successfully` : await response.text();
};

export const updateRoomState = async (id, estado) => {
  const response = await fetch(`${API_URL}/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, estado }),
  });
  return response.ok ? `Room ${id} state updated to ${estado}` : await response.text();
};