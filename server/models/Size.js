// models/Size.js
const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
  name: {
    type: [String], // Array of strings to store multiple sizes
    required: true,
  },
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Model', // Reference to the Model schema (you'll need to adjust this according to your existing models)
    required: true,
  },
});

const Size = mongoose.model('Size', sizeSchema);

module.exports = Size;
 