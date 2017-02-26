import Koa from 'koa';
import 'babel-polyfill';
import router from 'koa-router'
import MyUtilities from './utilities';
import routes from './routes';
import mongoose from 'mongoose';
import bodyParser from 'koa-bodyparser';
import CustomException from './error'
import cors from 'koa-cors';

let cache = require('koa-rest-cache');

let app = new Koa();
let _ = router();

app.use(cors({
	methods: 'GET,PATCH,POST,DELETE'
}));

//caching
/*app.use(cache({
  pattern: '/rates',
  maxAge: 600000 // ms
}));*/

app.use(bodyParser());

//load controllers
MyUtilities.dynamicRequire('./controllers');

MyUtilities.dynamicRequire('./models');

for (let key in routes) {
	let x = key.split(" ");
	let method = x[0].toLowerCase();
	let path = x[1];
		

	_[method](path, MyUtilities.refObj(routes[key]));
}

//Error handling middleware
app.use(async (ctx, next) => {
	try {
	   	await next();
	} catch (err) {
	  	if (err instanceof CustomException) {
	        ctx.body = {
	        	code: err.code,
	        	message: err.message
	        };

	        ctx.status = 400;
	        
	    } else if (err.name === 'ValidationError') {
	        ctx.status = 400;
	        ctx.body = {
				code: 'INVALID_REQUEST',
				message: err.message,
				errors: err.errors
	        };
		} else if (err.name === 'Not Found') {
	        ctx.status = 400;
	        ctx.body = {
				code: 'Resource not found',
				message: err.message,
				errors: err.errors
			};
		} else {
	        ctx.body = {
	          code: 'INTERNAL_SERVER_ERROR',
	          message: err.message
	        };
	        ctx.status = 500;
	    }

	    //ctx.app.emit('error', err, ctx);
	}
});

app.use(_.routes());

app.listen(3000);
console.log("Listening on port " + 3000);




module.exports = app;