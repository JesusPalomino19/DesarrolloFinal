const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');
const roomRoutes = require('./routes/roomRoutes');
const cors = require('cors');
require('./utils/otel'); // Asegúrate de importar el archivo de configuración de OpenTelemetry

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/rooms', roomRoutes);

const PORT = process.env.PORT || 3000;

connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Database connection failed:', err));
