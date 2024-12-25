const Room = require('../models/Room');
const { trace } = require('@opentelemetry/api');
const tracer = trace.getTracer('room-controller'); // Crea el tracer

// Obtener todas las habitaciones
const getRooms = async (req, res) => {
  const span = tracer.startSpan('getRooms'); // Inicia una traza personalizada

  try {
    const rooms = await Room.find(); // Obtiene todas las habitaciones
    span.setStatus({ code: 0 }); // Estado OK de la traza
    res.json(rooms); // Devuelve las habitaciones como JSON
  } catch (err) {
    span.setStatus({ code: 2, message: 'Error fetching rooms' }); // Error en la traza
    console.error('Error fetching rooms:', err);
    res.status(500).json({ error: 'Error fetching rooms' }); // Devuelve un error si algo falla
  } finally {
    span.end(); // Finaliza la traza
  }
};

// Reservar una habitación
const reserveRoom = async (req, res) => {
  const { id } = req.body;
  const span = tracer.startSpan('reserveRoom'); // Inicia una traza personalizada

  try {
    const room = await Room.findOne({ id });
    if (!room) {
      span.setStatus({ code: 2, message: 'Room not found' }); // Error de traza
      return res.status(404).send('Room not found');
    }
    if (room.estado !== 'disponible') {
      span.setStatus({ code: 2, message: 'Room is not available' }); // Error de traza
      return res.status(400).send('Room is not available');
    }

    room.estado = 'reservada';
    await room.save();
    span.setStatus({ code: 0 }); // Estado OK de la traza
    res.status(200).send(`Room ${id} reserved successfully`);
  } catch (err) {
    span.setStatus({ code: 2, message: 'Internal Server Error' }); // Error de traza
    res.status(500).send('Internal Server Error');
  } finally {
    span.end(); // Finaliza la traza
  }
};

// Pagar una habitación
const payRoom = async (req, res) => {
  const { id } = req.body;
  const span = tracer.startSpan('payRoom'); // Inicia una traza personalizada

  try {
    const room = await Room.findOne({ id });
    if (!room) {
      span.setStatus({ code: 2, message: 'Room not found' }); // Error de traza
      return res.status(404).send('Room not found');
    }
    if (room.estado !== 'reservada') {
      span.setStatus({ code: 2, message: 'Room is not reserved' }); // Error de traza
      return res.status(400).send('Room is not reserved');
    }

    room.estado = 'pagada';
    await room.save();
    span.setStatus({ code: 0 }); // Estado OK de la traza
    res.status(200).send(`Room ${id} paid successfully`);
  } catch (err) {
    span.setStatus({ code: 2, message: 'Internal Server Error' }); // Error de traza
    res.status(500).send('Internal Server Error');
  } finally {
    span.end(); // Finaliza la traza
  }
};

// Insertar habitaciones masivamente
const insertRooms = async (req, res) => {
  const span = tracer.startSpan('insertRooms'); // Inicia una traza personalizada

  try {
    const rooms = req.body; // Obtiene los datos enviados en el cuerpo de la solicitud
    const insertedRooms = await Room.insertMany(rooms); // Inserta los datos en la base de datos
    span.setStatus({ code: 0 }); // Estado OK de la traza
    res.status(201).json(insertedRooms); // Devuelve las habitaciones insertadas como JSON
  } catch (err) {
    span.setStatus({ code: 2, message: 'Error inserting rooms' }); // Error de traza
    console.error('Error inserting rooms:', err);
    res.status(500).json({ error: 'Error inserting rooms' });
  } finally {
    span.end(); // Finaliza la traza
  }
};

// Actualizar el estado de una habitación
const updateRoomState = async (req, res) => {
  const { id, estado } = req.body;
  const span = tracer.startSpan('updateRoomState'); // Inicia una traza personalizada

  try {
    const room = await Room.findOne({ id });
    if (!room) {
      span.setStatus({ code: 2, message: 'Room not found' }); // Error de traza
      return res.status(404).send('Room not found');
    }

    room.estado = estado; // Cambia el estado a lo que se pase en la solicitud
    await room.save();
    span.setStatus({ code: 0 }); // Estado OK de la traza
    res.status(200).send(`Room ${id} state updated to ${estado}`);
  } catch (err) {
    span.setStatus({ code: 2, message: 'Error updating room state' }); // Error de traza
    res.status(500).send('Error updating room state');
  } finally {
    span.end(); // Finaliza la traza
  }
};

module.exports = { reserveRoom, payRoom, insertRooms, getRooms, updateRoomState }; // Exporta las funciones para que puedan ser utilizadas en otros archivos