const { mongoose } = require('../database');

const Video = mongoose.model(
  'Video',
  mongoose.Schema({
    title: {
      type: String,
      required: 'Title is required'
    },
    description: {
      type: String
    },
    url: {
      type: String,
      required: 'URL is required'
    }
  })
);

module.exports = Video;
