import MyUtilities from '../utilities';
import moment from 'moment';
import CustomException from '../error'

let util = MyUtilities;

export let ConversionController = {
	convert: async (ctx) => {
		ctx.body = "update";

		let conversionRequest = ctx.request.body;
		let currencyDate = moment(ctx.params.date).format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');

		Rate.validateConversion(conversionRequest);

		let rate = await Rate
			.find({"date":{$lte: currencyDate}})
			.sort({"date":-1})
			.limit(1)
			.exec();

		if (!rate || rate.length < 1) {
	      throw new CustomException("", "Currency Exchange not found");
   		}

   		ctx.body = util.convert(rate[0], conversionRequest.base, conversionRequest.values);

	},

	create: async (ctx) => {
		
		let rateRequest = ctx.request.body;
		rateRequest.date = moment(ctx.params.date).format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');

		let query = {'date':rateRequest.date};

		//validation
		rateRequest = Rate.validateRequest(rateRequest);

		let rate = await Rate
			.findOneAndUpdate(query, rateRequest, {upsert:true})
			.exec();

		ctx.status = 201;
		ctx.body = "created";
	},

	remove: async (ctx) => {
		ctx.body = "remove";
	},

	retrieve: async (ctx) => {

		let rateRequest = new Rate();
		let currencies = ctx.query.currencies;
		currencies = (currencies == null || currencies.length < 1) ? null : currencies.split(',');

		let base = ctx.query.base || "USD";

		Rate.validateBase(base);

		rateRequest.date = ctx.params.date || moment().format('YYYY-MM-DD');

		let rate = await Rate
			.find({"date":{$lte: rateRequest.date}})
			.sort({"date":-1})
			.limit(1)
			.exec();

 
		if (!rate || rate.length < 1) {
	      throw new CustomException("", "Currency Exchange not found");
   		}
		let currencyRate = util.exchangeRate(rate[0], base, currencies);

		ctx.body = currencyRate;

		

	}
}