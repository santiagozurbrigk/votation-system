import express from 'express';
import VoteCode from '../models/VoteCode.js';

const router = express.Router();

// Generar códigos de votación
router.post('/generate', async (req, res) => {
  try {
    const { count = 100 } = req.body;
    const codes = [];

    for (let i = 0; i < count; i++) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      codes.push({ code, isUsed: false });
    }

    await VoteCode.insertMany(codes);
    res.json({ 
      message: `${count} códigos generados exitosamente`,
      codes: codes.map(c => c.code)
    });
  } catch (error) {
    console.error('Error al generar códigos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Verificar código de votación
router.post('/verify', async (req, res) => {
  try {
    const { code } = req.body;
    
    const voteCode = await VoteCode.findOne({ code });
    
    if (!voteCode) {
      return res.status(400).json({ message: 'Código inválido' });
    }
    
    if (voteCode.isUsed) {
      return res.status(400).json({ message: 'Código ya utilizado' });
    }
    
    res.json({ message: 'Código válido', codeId: voteCode._id });
  } catch (error) {
    console.error('Error al verificar código:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Marcar código como usado
router.post('/use', async (req, res) => {
  try {
    const { codeId } = req.body;
    
    await VoteCode.findByIdAndUpdate(codeId, {
      isUsed: true,
      usedAt: new Date()
    });
    
    res.json({ message: 'Código marcado como usado' });
  } catch (error) {
    console.error('Error al marcar código como usado:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener estadísticas de códigos
router.get('/stats', async (req, res) => {
  try {
    const total = await VoteCode.countDocuments();
    const used = await VoteCode.countDocuments({ isUsed: true });
    const available = total - used;
    
    res.json({
      total,
      used,
      available
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;
