// -----------------------------------------------------------
// require necessary modules
// -----------------------------------------------------------


var keys = require('./keys.js');
	twitter = require('twitter');
	spotify = require('spotify');
	request = require('request');
	fs = require('fs');


// -----------------------------------------------------------
// arguments concatenator function
// -----------------------------------------------------------


var query = '';

for(var i = 3; i < process.argv.length; i++) {
	query += ' '+process.argv[i];
};


// -----------------------------------------------------------
// logging code
// -----------------------------------------------------------


var new_command = '';

for(var i = 0; i < process.argv.length; i++) {
	new_command += process.argv[i]+' ';
}

fs.appendFile('./log.txt', new_command.trim()+'\n\n', (err) => {
	if (err) return console.log(err);
});


// -----------------------------------------------------------
// choose action code
// -----------------------------------------------------------


switch (process.argv[2]) {
	
	case 'my-tweets':
		getTwitter();
		break;
	
	case 'spotify-this-song':
		getSpotify();
		break;
	
	case 'movie-this':
		getOMDB();
		break;
	
	case 'do-what-it-says':
		doWhatItSays();
		break;

}


// -----------------------------------------------------------
// spotify code
// -----------------------------------------------------------


function getSpotify() {

	spotify.search({

		type : 'track',
		query : query.trim()

	}, (err, data) => {
		
		if(err) {
			console.log('Error occurred: ' + err);
			return;
		}
		
		console.log(data.tracks.items[5].artists[0].name);
		console.log(data.tracks.items[5].name);
		console.log(data.tracks.items[5].preview_url);
		console.log(data.tracks.items[5].album.name);

		fs.appendFile('./log.txt', data, (err) => {
			if (err) return console.log(err);
		});

	});

}


// -----------------------------------------------------------
// twitter code
// -----------------------------------------------------------


function getTwitter() {

	var client = new twitter({
		consumer_key : keys.twitterKeys.consumer_key,
		consumer_secret : keys.twitterKeys.consumer_secret,
		access_token_key : keys.twitterKeys.access_token_key,
	 	access_token_secret : keys.twitterKeys.access_token_secret
	});


	// var track = query.trim();

	// var stream = client.stream('statuses/filter', {track: track});

	// stream.on('data', (event) => {
	//   console.log(event && event.text);
	// });
	 
	// stream.on('error', (error) => {
	//   throw error;
	// });




	var params = { screen_name : 'Darth_Asztalos' };

	client.get('statuses/user_timeline', params, (error, tweets, response) => {
		
		if(!error) {

			// console.log( tweets );
			for(var i = 0; i < tweets.length; i++) {
				console.log('\n');
				console.log(tweets[i].created_at);
				console.log(tweets[i].text);
			}

		}

	});

}


// -----------------------------------------------------------
// omdb code
// -----------------------------------------------------------


function getOMDB() {

	request('http://www.omdbapi.com/?t='+query.trim()+'&y=&plot=short&tomatoes=true&r=json', (error, response, body) => {

		if (!error && response.statusCode == 200) {

			console.log("Title: " + JSON.parse(body).Title);
			console.log("Year: " + JSON.parse(body).Year);
			console.log("IMDB rating: " + JSON.parse(body).imdbRating);
			console.log("Country: " + JSON.parse(body).Country);
			console.log("Language: " + JSON.parse(body).Language);
			console.log("Plot: " + JSON.parse(body).Plot);
			console.log("Actors: " + JSON.parse(body).Actors);
			console.log("Rotten Tomatoes rating: " + JSON.parse(body).tomatoRating);
			console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);

		}

	});

}


// -----------------------------------------------------------
// do-what-it-says code
// -----------------------------------------------------------


function doWhatItSays() {

	// get random line from random.txt
	function get_line(filename, line_no, callback) {
		var data = fs.readFileSync(filename, 'utf8');
		var lines = data.split("\n");
		callback(null, lines[+line_no]);
	}

	function rand(min, max) {
		return (Math.floor(Math.random() * (max - min)) + min);
	}

	// size of random.txt
	var max = fs.readFileSync('./random.txt').toString().split('\n').length;

	get_line('./random.txt', rand(0, max), (err, line) => {
		// console.log('The line: ' + line);
		process.argv[2] = line;
	});

}


