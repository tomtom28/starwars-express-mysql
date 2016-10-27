// Dependencies
// =============================================================
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

// Require mySQL node package
var mysql = require('mysql');

// ----------------------------------------------------------------------------------------------------------------------
// Link to mySQL Database (NOTE THIS IS COMMENTED OUT... EACH CONNECTION TO SQL NEEDS TO BE DONE OVER AFTER DICONNECTION)
// REFER TO THIS LINK FOR INFO.. http://stackoverflow.com/questions/14087924/cannot-enqueue-handshake-after-invoking-quit
// YOU WILL SEE ME INCLUDE THIS CONNECTION VARAIBLE INSIDE EACH API GET/POST
// ----------------------------------------------------------------------------------------------------------------------
// var connection = mysql.createConnection({
//     host: "localhost",
//     port: 3306,
//     user: "root", //Your username
//     password: sqlPassword, //Your password
//     database: "starwars"
// });


// ******************************* ADD YOUR SQL PASSWORD HERE *******************************
var sqlPassword = "yourPassword";


// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// Star Wars Characters (DATA)
// =============================================================
// var characters = [{
// 	routeName: 'yoda',
// 	name: 'Yoda',
// 	role: 'Jedi Master',
// 	age: 900,
// 	forcePoints: 2000
// }, {
// 	routeName: 'darthmaul',
// 	name: 'Darth Maul',
// 	role: 'Sith Lord',
// 	age: 200,
// 	forcePoints: 1200
// }, {
// 	routeName: 'obiwankenobi',
// 	name: 'Obi Wan Kenobi',
// 	role: 'Jedi Master',
// 	age: 55,
// 	forcePoints: 1350
// }];



// Pull All Characters from SQL
function getCharacters(callback){
	
	// Link to mySQL Database
	var connection = mysql.createConnection({
	    host: "localhost",
	    port: 3306,
	    user: "root", //Your username
	    password: sqlPassword, //Your password
	    database: "starwars"
	});


	// Connect to DataBase
	connection.connect(function(err) {
	  if (err) throw err;

	  console.log("connected as id " + connection.threadId);

	 	connection.query('SELECT * FROM characters', function(err, res){

    	if(err){
        console.log('\nSorry. The SQL database could not be reached.');
        // console.log(err)
        connection.end(); // end the script/connection
      }
      else{

      	// Intialize/Re-set Character Array
				characters = [];

      	// Create Constructor
      	function Character(routeName, name, role, age, forcePoints){
      		this.routeName = routeName;
      		this.name = name;
					this.role = role;
					this.age = age;
					this.forcePoints = forcePoints;
      	}

      	// Loop through SQL Response and Make Character Objects (using constructor)
				for(var i = 0; i < res.length; i++){

					// New instance of a character
					var currentCharacter = new Character(res[i].RouteName, res[i].CharName, res[i].CharRole, res[i].CharAge, res[i].ForcePoints);

					// Push current instance of character to characters array
					characters.push(currentCharacter);

				}

       	connection.end(); // end the script/connection

				// Fire Off Call back function
				callback(characters);

      }
		
		}); // end update query

	}); // end database connection
}



// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'view.html'));
});

app.get('/add', function (req, res) {
	res.sendFile(path.join(__dirname, 'add.html'));
});

// Search for Specific Character (or all characters) - provides JSON
app.get('/api/:characters?', function (req, res) {
	var chosen = req.params.characters;

	// Query Characters from SQL (note the callback function!)
	getCharacters(function(characters){
		
		if (chosen) {
		console.log(chosen);

			for (var i = 0; i < characters.length; i++) {
				if (chosen === characters[i].routeName) {
					res.json(characters[i]);
					return;
				}
			}

			res.json(false);
		} else {
			res.json(characters);
		}

	});


});

// Create New Characters - takes in JSON input
app.post('/api/new', function (req, res) {
	var newcharacter = req.body;
	newcharacter.routeName = newcharacter.name.replace(/\s+/g, '').toLowerCase();


	// Link to mySQL Database
	var connection = mysql.createConnection({
	    host: "localhost",
	    port: 3306,
	    user: "root", //Your username
	    password: sqlPassword, //Your password
	    database: "starwars"
	});


	// Push to SQL
	connection.connect(function(err) {
	  if (err) throw err;
	  console.log("connected as id " + connection.threadId);

	 	connection.query('INSERT INTO characters SET ?', {
	      RouteName: newcharacter.routeName,
	      CharName: newcharacter.name,
	      CharRole: newcharacter.role,
	      CharAge: newcharacter.age,
	      ForcePoints: newcharacter.forcePoints
	    }, function(err, res){

    	if(err){
        console.log('\nSorry. The SQL database could not be updated.');
        // console.log(err)
        connection.end(); // end the script/connection
      }
      else{
        console.log('\nCharacter was added to SQL database!')
        connection.end(); // end the script/connection
      }
		
		}); // end update query

	}); // end database connection



	res.json(newcharacter);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
	console.log('App listening on PORT ' + PORT);
});
