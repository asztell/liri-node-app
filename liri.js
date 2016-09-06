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

if(process.argv[3]) {
	for(var i = 3; i < process.argv.length; i++) {
		query += ' '+process.argv[i];
	};
}


// -----------------------------------------------------------
// logging code
// -----------------------------------------------------------


var new_command = '';

for(var i = 0; i < process.argv.length; i++) {
	new_command += process.argv[i]+' ';
}

fs.appendFile('./log.txt', new_command.trim()
							+'\n\n------------------------------------------------------------------'
							+'\n', (err) => {
	if (err) return console.log(err);
});

run();


// -----------------------------------------------------------
// choose action code
// -----------------------------------------------------------


function run() {

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
		
		for(var i = 0; i < 3; i++) {
			console.log(' ');
			console.log('Artist: '+data.tracks.items[i].artists[0].name);
			console.log('Track: '+data.tracks.items[i].name);
			console.log('Prieview URL: '+data.tracks.items[i].preview_url);
			console.log('Album: '+data.tracks.items[i].album.name);

			fs.appendFile('./log.txt', '\nArtist: '+data.tracks.items[i].artists[0].name
										+'\nTrack: '+data.tracks.items[i].name
										+'\nPrieview URL: '+data.tracks.items[i].preview_url
										+'\nAlbum: '+data.tracks.items[i].album.name
										+'\n', (err) => {	if (err) return console.log(err); });
		}
		console.log(' ');
		// console.log(data);

		fs.appendFile('./log.txt', '\n'
									+'================================================================='
									+'\n\n', (err) => {
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

				fs.appendFile('./log.txt', '\n'+tweets[i].created_at
											+'\n'+tweets[i].text
											+'\n', (err) => {	if (err) return console.log(err); });
			}

		fs.appendFile('./log.txt', '\n'
									+'================================================================='
									+'\n\n', (err) => {
			if (err) return console.log(err);
		});


		}

	});

}


// -----------------------------------------------------------
// omdb code
// -----------------------------------------------------------


function getOMDB() {

	if(query.length <= 0) query = 'Mr. Nobody';

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

			fs.appendFile('./log.txt', '\n'+"Title: " + JSON.parse(body).Title
									+'\n'+"Year: " + JSON.parse(body).Year
									+"\nIMDB rating: " + JSON.parse(body).imdbRating
									+"\nCountry: " + JSON.parse(body).Country
									+"\nLanguage: " + JSON.parse(body).Language
									+"\nPlot: " + JSON.parse(body).Plot
									+"\nActors: " + JSON.parse(body).Actors
									+"\nRotten Tomatoes rating: " + JSON.parse(body).tomatoRating
									+"\nRotten Tomatoes URL: " + JSON.parse(body).tomatoURL
									+'\n', (err) => {	if (err) return console.log(err); });

			fs.appendFile('./log.txt', '\n'
									+'================================================================='
									+'\n\n', (err) => {
			if (err) return console.log(err);
		});

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

		process.argv[2] = line.split(', "')[0];

		if(process.argv[2].charAt(1) != 'y') {
			query = line.split(', "')[1].split('"')[0];
		}

		run();

	});

}


