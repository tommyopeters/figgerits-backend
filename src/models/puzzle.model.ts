export { };

const mongoose = require('mongoose');
const PuzzleSchema = new mongoose.Schema(
  {
    quote: {
      type: String,
      required: [true, "Please provide a quote"],
    },
    info: {
      type: String,
      required: true,
    },
    clues: [
      {
        word: {
          type: String,
          required: true,
        },
        clue: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  })

const Puzzle = mongoose.model('Puzzle', PuzzleSchema);

module.exports = Puzzle;