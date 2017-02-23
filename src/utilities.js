import path from 'path';
import _ from 'lodash';
import money from 'money';
import CustomException from './error';

class MyUtilities {

	/**
	 * Require all files inside a directory
	 * @param {string} dir
	 * @param {string} namespace
	 */
	static dynamicRequire(dir, namespace) {
		let normalizedPath = path.join(__dirname, dir);
		let files = require('fs').readdirSync(normalizedPath);
		_.each(files, file => {
			let mod = require(path.resolve(__dirname, dir, file));
			if (namespace) {
				global[namespace] = _.merge(global[namespace] || {}, mod);
			} else {
				_.merge(global, mod);
			}
		});
	}

	//test method
	helloWorld () {
		console.log('Hello World! <3');
	}

	static refObj(stringObject) {
		let finalObject;
		let parts = stringObject.split('.');
		for (let i = 0, obj = global; i < parts.length; ++i) {
			obj = obj[parts[i]];
			finalObject = obj;
		}

		return finalObject;
	}

	static exchangeRate(xrates, newBase, currencies){

		try{

			//add default base to the rates base = 1
			if(!xrates.rates.hasOwnProperty(xrates.base)){
				xrates.rates[xrates.base] = 1;
			}

			let base = newBase.toUpperCase();
			//check if the new base has currency value on the rates object
			if(!xrates.rates.hasOwnProperty(base)){
				throw new CustomException('','base currency not found for this currency exchange');
			}

			money.base = xrates.base;
			money.rates = xrates.rates;

			let conversionRates = {};

			for (let key in xrates.rates) {
				if(key !== base){
					conversionRates[key] = money.convert(1,  {from: base, to: key}).toFixed(2);
				}
			}

			if(currencies != null){
				let currencyConversion = {};
				for(let i=0;i<currencies.length;i++){
					for(let key in conversionRates){
						if(currencies[i].toUpperCase() === key){
							currencyConversion[key] = conversionRates[key];
							//console.log(currencyConversion[key] );
						}
					}
				}

				conversionRates = currencyConversion;
			}

			let rateResponse = {};
			rateResponse.date = xrates.date;
			rateResponse.base = base;
			rateResponse.rates = conversionRates;

			return rateResponse;
		} catch(err){

			if(err instanceof CustomException){
				throw err;
			}

			throw new CustomException('Internal server error","Something went wrong!');
		}
	}

	static convert(xrates, base, values){

		try{

			base = base.toUpperCase();
			//add default base to the rates base = 1
			if(!xrates.rates.hasOwnProperty(xrates.base)){
				xrates.rates[xrates.base] = 1;
			}

			//check if the new base has currency value on the rates object
			if(!xrates.rates.hasOwnProperty(base)){
				throw new CustomException('','base currency not found for this currency exchange');
			}

			money.base = xrates.base;
			money.rates = xrates.rates;

			let conversionRates = [];

			for(let i=0;i<values.length;i++){

				let res = {};
				let currencyName = values[i].currency.toUpperCase();
				console.log(currencyName);

				if(money.rates.hasOwnProperty(currencyName)){
					let convertedValue = money(values[i].value).from(currencyName).to(base);
					res['before'] = values[i].value + ' ' + currencyName;
					res['after'] = convertedValue.toFixed(2) + ' ' + base;
					
				} else {
					res['before'] = values[i].value.toFixed(2) + ' ' + currencyName;
					res['after'] = 'Cannot convert the currency to ' + base;
				}


				conversionRates.push(res);
			}

			return conversionRates;

		} catch(err){

			if(err instanceof CustomException){
				throw err;
			}

			throw new CustomException('Internal server error","Something went wrong!');
		}
	}
}


export default MyUtilities;