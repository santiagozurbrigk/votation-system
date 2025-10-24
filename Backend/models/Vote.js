import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  categoryId: {
    type: String,
    required: true,
    enum: [
      'mejor-director',
      'mejor-actor',
      'mejor-actor-secundario',
      'mejor-actriz',
      'mejor-actriz-secundaria',
      'mejor-editor',
      'vestuario-escenografia',
      'revelacion',
      'mejor-pelicula'
    ]
  },
  candidateId: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  clientIP: {
    type: String,
    required: true
  },
  userFingerprint: {
    type: String,
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Vote = mongoose.model('Vote', voteSchema);

export default Vote;
