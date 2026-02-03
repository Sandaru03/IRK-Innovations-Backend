const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String, // Short description for card
    required: true
  },
  mainImage: {
    type: String,
    required: true
  },
  detailImages: {
    type: [String], // Array of image URLs for the details page
    default: []
  },
  video: {
    type: String // URL for the video
  },
  liveLink: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
