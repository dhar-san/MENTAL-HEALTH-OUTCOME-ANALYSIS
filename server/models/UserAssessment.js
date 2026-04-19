/**
 * UserAssessment Model
 * Tracks which questions have been assigned to each user
 * Ensures uniqueness - users don't receive the same questions twice
 */
const mongoose = require('mongoose');

const userAssessmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    questionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    lastAssignedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserAssessment', userAssessmentSchema);
