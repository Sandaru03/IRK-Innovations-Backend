const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true // Assuming image URL or path needs to be required
  },
  techStack: {
    type: [String], // Array of strings to list technologies
    default: []
  },
  liveLink: {
    type: String
  },
  githubLink: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
