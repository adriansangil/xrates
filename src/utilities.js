import path from 'path';
import _ from 'lodash';

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
		console.log("Hello World! <3");
	}

	static refObj(stringObject) {
		let finalObject;
		let parts = stringObject.split(".");
		for (let i = 0, obj = global; i < parts.length; ++i) {
  		  obj = obj[parts[i]];
  		  finalObject = obj;
		}

		return finalObject;
	}
}


export default MyUtilities;