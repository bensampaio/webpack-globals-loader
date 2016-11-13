const fs = require('fs');
const loaderUtils = require("loader-utils");

/**
 * Stores the loaded resources.
 * @type {Object}
 */
const loadedResources = {};

/**
 *
 * @param {string} content
 * @returns {string}
 */
module.exports = (content) => {

	const query = loaderUtils.parseQuery(this.query);
	const outputName = (query.o || 'vendor');

	const inputFile = this.resourcePath;
	const outputFile = this.options.output.path + '/' + outputName + '.js';

	const fsOptions = { encoding : 'utf8' };

	this.cacheable && this.cacheable();
	if (!this.emitFile) throw new Error("emitFile is required from module system");

	// If no resources have been loaded yet it means the file has to be emptied
	if (!(outputName in loadedResources)) {
		loadedResources[outputName] = {};
		fs.writeFileSync(outputFile, content, fsOptions);
	}

	// If module not loaded yet
	else if (!(inputFile in loadedResources[outputName])) {
		fs.appendFileSync(outputFile, content, fsOptions);
	}

	// Save module as loaded so we don't have to load it again
	loadedResources[outputName][inputFile] = true;

	return '';

}