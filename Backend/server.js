import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import voteRoutes from './routes/votes.js';
import resultRoutes from './routes/results.js';
import voteCodeRoutes from './routes/voteCodes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configurar CORS
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://system-votation-english.vercel.app',
    'https://system-votation-english-ka4qftlxz.vercel.app',
    'https://system-votation-english-c8m14asxo.vercel.app',
    'https://*.vercel.app' // Permitir todos los subdominios de Vercel
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/votacion-instituto')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// Rutas
app.use('/api/votes', voteRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/vote-codes', voteCodeRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API del Sistema de Votación - Instituto San José' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
