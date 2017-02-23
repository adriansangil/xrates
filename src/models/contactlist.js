import db from '../connection/db-mongo';
import mongoose from 'mongoose';



let Schema = mongoose.Schema;


let contactlistSchema = new Schema({
	name: String,
	email: String,
	number: String,
});


export let contactlist = db.model('contactlist', contactlistSchema, 'contactlist');