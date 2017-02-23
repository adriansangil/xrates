import db from '../connection/db-mongo';
import mongoose from 'mongoose';
import CustomException from '../error';

let Schema = mongoose.Schema;


let RateSchema = new Schema({
	date: Date,
	base: {type: String,  required: true },
	rates: { type: Schema.Types.Mixed, required: true }
});

RateSchema.statics.validateRequest = function validateRequest (req) {

    //rates
	if(!req.hasOwnProperty('rates') || req.rates == null || typeof req.rates != 'object'){
		throw new CustomException('Invalid Request','rates is missing');
	}

	let updateRate = {};

	for(let key in req.rates){
		let i = key.search(/^[a-zA-Z]*$/);
		if(i < 0){
			throw new CustomException('Invalid Request','rate is malformed');
		}

		let j = req.rates[key];

		if(j.toString().search(/^[0-9]+([,.][0-9]+)?$/)<0){
			throw new CustomException('Invalid Request','rate values incorrect');
		}

		updateRate[key.toUpperCase()] = j;
	}

	//base
	if(!req.hasOwnProperty('base')){
		throw new CustomException('Invalid Request','base is missing');
	}

	if(req.base.search(/^[a-zA-Z]*$/) < 0){
		throw new CustomException('Invalid Request','base is malformed');
	}

	req.base = req.base.toUpperCase();
	req.rates = updateRate;

	return req;
};

RateSchema.statics.validateRate = function validateRate (req) {
    
    //rates
	if(!req.hasOwnProperty('rates') || req.rates == null || typeof req.rates != 'object'){
		throw new CustomException('Invalid Request', 'rates is missing');
	}

	for(let key in req.rates){
		let i = key.search(/^[a-zA-Z]*$/);
		if(i < 0){
			throw new CustomException('Invalid Request','rate is malformed');
		}

		let j = req.rates[key].search(/^[0-9]+([,.][0-9]+)?$/);
		if(j<0){
			throw new CustomException('Invalid Request','rate value malformed');
		}
	}
};

RateSchema.statics.validateBase = function validateBase (base) {
    
	if(typeof base != 'string' || base.search(/^[a-zA-Z]*$/) < 0){
		throw new CustomException('Invalid Request','base is malformed');
	}
};

RateSchema.statics.validateConversion = function validateConversion (req) {

	if(!req.hasOwnProperty('base')){
		throw new CustomException('Invalid Request','base is missing');
	}
    
	if(req.base.search(/^[a-zA-Z]*$/) < 0){
		throw new CustomException('Invalid Request','base is malformed');
	}

	if(!req.hasOwnProperty('values') ||  Object.prototype.toString.call( req.values ) !== '[object Array]'){
		throw new CustomException('Invalid Request', 'values missing');
	}

	let a = req.values;
	for(let key in a){

		if(!a[key].hasOwnProperty('currency')){
			throw new CustomException('Invalid Request','currency is missing');
		}

		if(!a[key].hasOwnProperty('value')){
			throw new CustomException('Invalid Request','currency value is missing');
		}
		/*let i = a[key].search(/^[a-zA-Z]*$/);
		if(i < 0){
			throw new CustomException('Invalid Request','currency is malformed');
		}

		let j = req.rates[key].search(/^[0-9]+([,.][0-9]+)?$/);
		if(j<0){
			throw new CustomException('Invalid Request','rate value malformed');
		}*/
	}
};

export let Rate = db.model('Rate', RateSchema);