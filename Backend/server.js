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
  origin: function (origin, callback) {
    // Permitir requests sin origin (ej: Postman, mobile apps)
    if (!origin) return callback(null, true);
    
    // Lista de dominios permitidos
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://system-votation-english.vercel.app',
      'https://system-votation-english-ka4qftlxz.vercel.app',
      'https://system-votation-english-c8m14asxo.vercel.app',
      'https://votation-system.vercel.app', // Nuevo dominio
      'https://votation-system-c8m14asxo.vercel.app', // Preview domain
    ];
    
    // Permitir cualquier subdominio de vercel.app
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    // Verificar si el origin está en la lista
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
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
