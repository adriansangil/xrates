import koa from 'koa';
import 'babel-polyfill';
import router from 'koa-router'
import MyUtilities from './utilities';
import routes from "./routes";

let app = koa();
let _ = router();
//let myUtil = myUtilities();

//load my controllers
MyUtilities.dynamicRequire('./controllers');

for (let key in routes) {
    let x = key.split(" ");
	let method = x[0].toLowerCase();
	let path = x[1];
	
	//console.log(method);
	//console.log(path);
	//console.log(routes[key]);

	_[method](path, MyUtilities.refObj(routes[key]));
}

/*_.get('/hello', getMessage); // Define routes

function *getMessage(){
	this.body = "Hello world!";
};*/

app.use(_.routes()); //Use the routes defined using the router

app.listen(3000);

let util = new MyUtilities();




