import mongoose from 'mongoose';

const voteCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  usedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const VoteCode = mongoose.model('VoteCode', voteCodeSchema);

export default VoteCode;
