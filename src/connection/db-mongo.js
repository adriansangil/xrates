import mongoose from 'mongoose';
let config = require('config');

console.log(process.env.NODE_ENV);

mongoose.connect(config.DBHost);

let db = mongoose.connection;
db.on('error', function(err) {
	console.error(err);
});

db.once('open', function() {
	// we're connected!
	console.log('connected to '+ config.env);
});


export default db;