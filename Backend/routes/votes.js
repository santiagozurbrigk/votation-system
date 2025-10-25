import express from 'express';
import Vote from '../models/Vote.js';

const router = express.Router();

// Enviar votos
router.post('/', async (req, res) => {
  try {
    const { votes, sessionId, userFingerprint } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;
    
    console.log('Votos recibidos:', votes);
    console.log('Session ID:', sessionId);
    console.log('User Fingerprint:', userFingerprint);
    console.log('Client IP:', clientIP);
    
    if (!votes || !sessionId) {
      return res.status(400).json({ message: 'Datos de votación requeridos' });
    }

    // Verificar que no se haya votado antes con esta sesión
    const existingVotes = await Vote.find({ sessionId });
    if (existingVotes.length > 0) {
      return res.status(400).json({ message: 'Ya se ha votado con esta sesión' });
    }

    // Verificar por IP (opcional - puede ser restrictivo en redes compartidas)
    // COMENTADO TEMPORALMENTE PARA TESTS DE CARGA
    // const votesFromSameIP = await Vote.find({ clientIP });
    // if (votesFromSameIP.length > 0) {
    //   console.log('Intento de voto duplicado desde la misma IP:', clientIP);
    //   return res.status(400).json({ message: 'Ya se ha votado desde esta ubicación' });
    // }

    // Crear votos
    const votePromises = Object.entries(votes).map(([categoryId, candidateId]) => {
      return Vote.create({
        categoryId,
        candidateId,
        sessionId,
        clientIP,
        userFingerprint
      });
    });

    await Promise.all(votePromises);

    res.json({ message: 'Votos registrados exitosamente' });
  } catch (error) {
    console.error('Error al registrar votos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener estadísticas de votación
router.get('/stats', async (req, res) => {
  try {
    const totalVotes = await Vote.countDocuments();
    const uniqueSessions = await Vote.distinct('sessionId');
    
    res.json({
      totalVotes,
      uniqueSessions: uniqueSessions.length
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;
