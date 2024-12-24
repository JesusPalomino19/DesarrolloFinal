const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');
const roomRoutes = require('./routes/roomRoutes');
const cors = require('cors');

// Inicializa dotenv para cargar variables de entorno
dotenv.config();

// Crea la aplicación Express
const app = express();

// Middleware para habilitar CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/rooms', roomRoutes);

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Conexión a la base de datos y arranque del servidor
connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Database connection failed:', err));
