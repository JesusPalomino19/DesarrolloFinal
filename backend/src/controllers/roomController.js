const Room = require('../models/Room');

const getRooms = async (req, res) => {
    try {
      const rooms = await Room.find(); // Obtiene todas las habitaciones
      res.json(rooms); // Devuelve las habitaciones como JSON
    } catch (err) {
      console.error('Error fetching rooms:', err);
      res.status(500).json({ error: 'Error fetching rooms' }); // Devuelve un error si algo falla
    }
  };
  

const reserveRoom = async (req, res) => {
  const { id } = req.body;
  try {
    const room = await Room.findOne({ id });
    if (!room) return res.status(404).send('Room not found');
    if (room.estado !== 'disponible') return res.status(400).send('Room is not available');

    room.estado = 'reservada';
    await room.save();
    res.status(200).send(`Room ${id} reserved successfully`);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
};

const payRoom = async (req, res) => {
  const { id } = req.body;
  try {
    const room = await Room.findOne({ id });
    if (!room) return res.status(404).send('Room not found');
    if (room.estado !== 'reservada') return res.status(400).send('Room is not reserved');

    room.estado = 'pagada';
    await room.save();
    res.status(200).send(`Room ${id} paid successfully`);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
};

const insertRooms = async (req, res) => {
    try {
      const rooms = req.body; // Obtiene los datos enviados en el cuerpo de la solicitud
      const insertedRooms = await Room.insertMany(rooms); // Inserta los datos en la base de datos
      res.status(201).json(insertedRooms); // Devuelve las habitaciones insertadas como JSON
    } catch (err) {
      console.error('Error inserting rooms:', err);
      res.status(500).json({ error: 'Error inserting rooms' });
    }
};

const updateRoomState = async (req, res) => {
  const { id, estado } = req.body;
  try {
    const room = await Room.findOne({ id });
    if (!room) return res.status(404).send('Room not found');

    // Si la habitación está pagada, podemos permitirle cambiar el estado
    // o cualquier otra lógica que desees implementar
    room.estado = estado; // Cambia el estado a lo que se pase en la solicitud
    await room.save();
    
    res.status(200).send(`Room ${id} state updated to ${estado}`);
  } catch (err) {
    res.status(500).send('Error updating room state');
  }
};

module.exports = { reserveRoom, payRoom, insertRooms, getRooms, updateRoomState }; // Exporta las funciones para que puedan ser utilizadas en otros archivos