import 'babel-polyfill';
import moment from 'moment';


let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();


chai.use(chaiHttp);

console.log(server);

describe('Rates', () => {
	before((done) => { 
		Rate.remove({}, (err) => { 
			done();         
		});     
	});


	describe('GET /rates', () => {
		it('it should not GET any conversion rate if no conversion rate stored yet', (done) => {
    		chai.request('http://localhost:3000')
			.get('/rates')
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a('object');
				res.body.should.have.property('code');
				res.body.should.have.property('message');
				done();
			});
		});
	});


	describe('GET /rates/:id', function() {


		let testDate = moment().format('YYYY-MM-DD');

		let rate = {
			date: testDate,
			base: 'USD',
			rates: {
				PHP: 30.15,
				MYR: 3.27,
				JPY: 122.59,
				THB: 36.22
			}
		};

		before(function () {
			let rateReq = new Rate(rate);
			rateReq.save(function (err, doc) {
			  if (err) return console.error(err);
			  	console.log('saved');
			});

		});


		it('should GET a conversion rate based on query date', (done) => {
    		chai.request('http://localhost:3000')
			.get('/rates/' + testDate)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('base');
				res.body.should.have.property('date');
				res.body.should.have.property('rates');
				done();
			});
		});

		testDate = moment().add(10,'days');

		it('should retrieve the latest conversion rate based on the query date', (done) => {
    		chai.request('http://localhost:3000')
			.get('/rates/' + testDate.format('YYYY-MM-DD'))
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('base');
				res.body.should.have.property('date').eql(moment().format('YYYY-MM-DD'));
				res.body.should.have.property('rates');
				done();
			});
		});

		it('should retrieve the latest conversion rate based on current date if data param has no value', (done) => {
    		chai.request('http://localhost:3000')
			.get('/rates/')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('base');
				res.body.should.have.property('date').eql(moment().format('YYYY-MM-DD'));
				res.body.should.have.property('rates');
				done();
			});
		});

		let base = 'PHP';

		it('should retrieve a conversion rate with the specified base if available', (done) => {
    		chai.request('http://localhost:3000')
			.get('/rates?base=' + base)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('base').eql(base);
				res.body.should.have.property('date').eql(moment().format('YYYY-MM-DD'));
				res.body.should.have.property('rates');
				done();
			});
		});

		let currency = 'PHP,MYR'

		it('should retrieve a conversion rate with the specified currency if available', (done) => {
    		chai.request('http://localhost:3000')
			.get('/rates?currencies=' + currency)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('base');
				res.body.should.have.property('date').eql(moment().format('YYYY-MM-DD'));
				res.body.should.have.property('rates');
				res.body.rates.should.have.property('PHP');
				res.body.rates.should.have.property('MYR');
				done();
			});
		});
	});

	describe('PUT /rates/:date', () => {

		let rate = {
			base: 'USD',
			rates: {
				PHP: 30.15,
				MYR: 3.27,
				JPY: 122.59,
				THB: 36.22
			}
		};

		let testDate = '2019-01-01';

		it('should create conversion rate based on date', (done) => {
			chai.request('http://localhost:3000')
			.put('/rates/'+ testDate)
			.send(rate)
			.end((err, res) => {
				res.should.have.status(201);
				done();
			});
		});
	});


	describe('PUT /rates/', () => {

		let rate = {
			base: 'USD',
			rates: {
				PHP: 30.15,
				MYR: 3.27,
				JPY: 122.59,
				THB: 36.22
			}
		};


		it('should create conversion rate based on current date if no date param is given',  (done) => {
			let  rateRes =  chai.request('http://localhost:3000')
			.put('/rates')
			.send(rate)
			.end((err, res) => {
				res.should.have.status(201);
				done();
			});

			
		});
	});


	describe('POST /rates/:date/convert', () => {

		let rate = {
			base: 'USD',
			values: [
				{
					currency: 'PHP',
					value: 90
				},
				{
					currency: 'PHP',
					value: 225
				},
				{
					currency: 'MYR',
					value: 42.7
				}
			]
		}

		let testDate = '2019-01-01';


		it('should convert the currency values to the specified base based on currency exchange in the given param date',  (done) => {
			let  rateRes =  chai.request('http://localhost:3000')
			.post('/rates/' + testDate + '/convert')
			.send(rate)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('Array');
				done();
			});

		});

		let invalidDate = '2010-01-01';

		it('should do no conversion if the param date does not match any exchange rate',  (done) => {
			let  rateRes =  chai.request('http://localhost:3000')
			.post('/rates/' + invalidDate + '/convert')
			.send(rate)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a('object');
				res.body.should.have.property('code');
				res.body.should.have.property('message');
				done();
			});

		});
	});


});

