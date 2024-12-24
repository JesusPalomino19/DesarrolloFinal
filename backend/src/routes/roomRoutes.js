const express = require('express');
const router = express.Router();
const { reserveRoom, payRoom, insertRooms, getRooms, updateRoomState } = require('../controllers/roomController');

// Endpoint para obtener todas las habitaciones
router.get('/', getRooms);

// Endpoint para reservar una habitación
router.post('/reserve', reserveRoom);

// Endpoint para pagar una habitación
router.post('/pay', payRoom);

// Endpoint para insertar habitaciones masivamente
router.post('/insert', insertRooms);

// Ruta PUT para actualizar el estado de la habitación
router.put('/update', updateRoomState);

module.exports = router;