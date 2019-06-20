console.log('this is loaded');

// var requirementSpotify = require("node-spotify-api");

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};
