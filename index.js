var fs = require('fs');
var loaderUtils = require("loader-utils");
var loadedResources = {};

var mkdirp = require('mkdirp');
var getDirName = require('path').dirname;

/**
 * Makes the directory path before trying to create the file
*/
function writeFile(path, contents, fsOptions) {
  mkdirp.sync(getDirName(path));
  fs.writeFileSync(path, contents, fsOptions);
}

module.exports = function(content) {
	var self = this;

	var query = loaderUtils.parseQuery(this.query);
	var outputName = (query.o || 'vendor');

	var inputFile = this.resourcePath;
	var outputFile = this.options.output.path + '/' + outputName + '.js';

	var fsOptions = { encoding : 'utf8' };

	this.cacheable && this.cacheable();
	if(!this.emitFile) throw new Error("emitFile is required from module system");

	// If no resources have been loaded yet it means the file has to be emptied
	if(!(outputName in loadedResources)) {
		loadedResources[outputName] = {};
		writeFile(outputFile, content, fsOptions);
	}

	// If module not loaded yet
	else if(!(inputFile in loadedResources[outputName])) {
		fs.appendFileSync(outputFile, content, fsOptions);
	}

	// Save module as loaded so we don't have to load it again
	loadedResources[outputName][inputFile] = true;

	return '';
}
