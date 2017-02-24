import mongoose from 'mongoose';
let config = require('config');

mongoose.connect(config.DBHost);

let db = mongoose.connection;
db.on('error', function(err) {
	console.error(err);
});

db.once('open', function() {
	// we're connected!
	console.log('connected');
});


export default db;