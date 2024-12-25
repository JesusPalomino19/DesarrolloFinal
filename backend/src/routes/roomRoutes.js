const express = require('express');
const router = express.Router();
const { trace } = require('@opentelemetry/api'); // Importa el tracer de OpenTelemetry
const { reserveRoom, payRoom, insertRooms, getRooms, updateRoomState } = require('../controllers/roomController');

// Crea un tracer
const tracer = trace.getTracer('room-routes');

// Middleware para instrumentar cada ruta
router.use((req, res, next) => {
  const span = tracer.startSpan(`HTTP ${req.method} ${req.originalUrl}`, {
    attributes: {
      'http.method': req.method,
      'http.url': req.originalUrl,
    },
  });

  // Cuando la respuesta termine, se cierra la traza
  res.on('finish', () => {
    span.setStatus({ code: res.statusCode < 400 ? 0 : 2 }); // Status code OK (0) o Error (2)
    span.end();
  });

  next();
});

// Endpoints
router.get('/', getRooms);
router.post('/reserve', reserveRoom);
router.post('/pay', payRoom);
router.post('/insert', insertRooms);
router.put('/update', updateRoomState);

module.exports = router;