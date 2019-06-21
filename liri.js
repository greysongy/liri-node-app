require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var inquirer = require("inquirer");
var axios = require("axios");
var fs = require("fs");

function takeInput() {
    inquirer
        .prompt([
            {
                type: "command",
                message: "Give Liri one of the following 4 comands, followed by a song, concert, or movie if necessary: \n concert-this \n spotify-this-song \n movie-this \n do what it says \n q to quit the application \n",
                name: "userResponse"
            }
        ])
        .then(function (response) {
            console.log("User response");
            console.log(response.userResponse);
            var split = response.userResponse.split(" ");
            var command = split[0];
            split.splice(0, 1);
            var secondPhrase = split.join(" ");
            if (command === 'q') {
                return;
            }
            switch (command) {
                case ("concert-this"):
                    // console.log("We'll concert something");
                    concertSomething(secondPhrase);
                    break;
                case ("spotify-this-song"):
                    // console.log("We'll spotify something");
                    spotifySomething(secondPhrase);
                    break;
                case ("movie-this"):
                    // console.log("We'll movie something");
                    movieSomething(secondPhrase);
                    break;
                case ("do-what-it-says"):
                    // console.log("We'll do what it says");
                    fs.readFile("random.txt", "utf8", function (error, data) {
                        if (error) {
                            return console.log(error);
                        }
                        console.log("Data");
                        console.log(data);
                        spotifySomething(data);
                    });
                    break;
                default:
                    console.log("I'm sorry, but that's not a proper command. Please ask Liribot something else.");
                    break;
            }
            takeInput();

        })
}
function concertSomething(artist) {
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(function (response) {
        // console.log("Response");
        // console.log(response.data);
        console.log("Upcoming Events");
        // console.log("///////////////////////");
        console.log("");
        for (var i = 0; i < response.data.length; i++) {
            console.log("Venue Name: " + response.data[i].venue.name);
            console.log("Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
            //convert correctly using moment.js
            console.log("Event Date: " + response.data[i].datetime);
            // console.log("///////////////////////");
            console.log("");
        }
    })
}

function spotifySomething(song) {
    spotify
        .search({ type: 'track', query: song })
        .then(function (response) {
            console.log("Response");
            console.log(response.tracks.items[0]);
            console.log("Artist(s): ");
            for (var i = 0; i < response.tracks.items[0].artists.length; i++) {
                console.log(response.tracks.items[0].artists[i].name);
            }
            console.log("Track Name: " + response.tracks.items[0].name);
            if (response.tracks.items[0].preview_url !== null) {
                console.log("Preview Link: " + response.tracks.items[0].preview_url);
            }
            console.log("Album: " + response.tracks.items[0].album.name);
        })
        .catch(function (err) {
            console.log(err);
        });
}

function movieSomething(movie) {
    console.log("Movie");
    console.log(movie);
    axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + movie).then(function (response) {
        // console.log("Response");
        // console.log(response.data);
        console.log("Response Data");
        console.log(response.data);
        console.log("Title: " + response.data.Title);
        console.log("Date of Release: " + response.data.Year);
        console.log("IMDB Rating: " + response.data.imdbRating);
        console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
        console.log("Country/countries where film was produced: " + response.data.Country);
        console.log("Language(s): " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
    })
}

takeInput();