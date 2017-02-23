export default {
	'GET /rates/:date': 'ConversionController.retrieve',
	'GET /rates': 'ConversionController.retrieve',
	'PUT /rates': 'ConversionController.create',
	'PUT /rates/:date': 'ConversionController.create',
	'DELETE /rates': 'ConversionController.remove',
	'POST /rates/:date/convert': 'ConversionController.convert',
};
