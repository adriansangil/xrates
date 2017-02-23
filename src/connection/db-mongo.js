import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/rate');

let db = mongoose.connection;
db.on('error', function(err) {
	console.error(err);
});

db.once('open', function() {
	// we're connected!
	console.log('connected');
});


export default db;