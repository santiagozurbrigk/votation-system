import express from 'express';
import Vote from '../models/Vote.js';

const router = express.Router();

// Obtener resultados por categoría
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const results = await Vote.aggregate([
      { $match: { categoryId } },
      { $group: { _id: '$candidateId', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json(results);
  } catch (error) {
    console.error('Error al obtener resultados:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener todos los resultados
router.get('/all', async (req, res) => {
  try {
    const categories = [
      'mejor-director',
      'mejor-actor',
      'mejor-actor-secundario',
      'mejor-actriz',
      'mejor-actriz-secundaria',
      'mejor-editor',
      'vestuario-escenografia',
      'revelacion',
      'mejor-pelicula'
    ];

    const results = {};

    for (const categoryId of categories) {
      const categoryResults = await Vote.aggregate([
        { $match: { categoryId } },
        { $group: { _id: '$candidateId', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      console.log(`Categoría ${categoryId}:`, categoryResults);

      results[categoryId] = categoryResults.reduce((acc, result) => {
        acc[result._id] = result.count;
        return acc;
      }, {});
    }

    // Obtener estadísticas generales
    const totalVotes = await Vote.countDocuments();
    const uniqueSessions = await Vote.distinct('sessionId');

    res.json({
      results,
      stats: {
        totalVotes,
        uniqueSessions: uniqueSessions.length
      }
    });
  } catch (error) {
    console.error('Error al obtener todos los resultados:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Reiniciar votación (eliminar todos los votos)
router.delete('/reset', async (req, res) => {
  try {
    await Vote.deleteMany({});
    res.json({ message: 'Votación reiniciada exitosamente' });
  } catch (error) {
    console.error('Error al reiniciar votación:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;
