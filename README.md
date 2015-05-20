# globals loader for webpack

## Motivation

I decided to create this loader after realising how difficult it was to simply require dependencies that just define global variables, like jQuery and AngularJS. Those dependencies are not modules and on some cases I don't think it makes any sense to force them to behave as so. Besides that, webpack also didn't provide a way to only include those dependencies in a file if they were explicitly required.

If you want to understand what I was trying to accomplish before I decided to develop this loader I suggest you read [my question](http://stackoverflow.com/questions/30329337/how-to-bundle-vendor-scripts-separately-and-require-them-as-needed-with-webpack/30346322) on stackoverflow.

## Usage

To require a file use the folllowing format:

```javascript
require("globals!file");
// => appends the contents of <file> to vendor.js file in the output folder specified in the webpack config file
// => returns nothing because <file> doesn't contain a module, it is supposed to be loaded as a global instead 
```

The require above just makes sure the contents of <file> are included in the output file. To make the globals available you need to include the vendor.js file on your HTML page:

```html
<script src="path/to/output/folder/vendor.js"></script>
```

If you want the generated file to have a different name use the 'o' query property to specify the file name without extension, as follows:

```javascript
require("globals?o=lib!file");
// => appends the contents of <file> to lib.js file in the output folder specified in the webpack config file

require("globals?o=relative/path/to/folder/lib!file");
// => appends the contents of <file> to relative/path/to/folder/lib.js file in the output folder specified in the webpack config file
```

## Examples

For all examples on this section let's assume we have the following `webpack.config.js` file:

```javascript
module.exports = {
	context: __dirname + '/src',
	entry: {
	    app: './main.js'
	},
	output: {
	    path: __dirname + '/dist',
	    filename: '[name].js'
	},
	resolve: {
	    alias: {
	        'jquery': __dirname + '/vendor/jquery.js',
	        'jquery.plugin1': __dirname + '/vendor/jquery.plugin1.js',
	        'jquery.plugin2': __dirname + '/vendor/jquery.plugin2.js',

	        'module1': __dirname + '/src/module1.js'

	    }
	},
}
```

If our `main.js` file contains the following:

```javascript
require("globals!jquery");
require("globals!jquery.plugin1");
```

When we run webpack a file with name `vendor.js` will be created in `__dirname + '/dist'` containing the code from `jquery` and `jquery.plugin1` files. When `vendor.js` is included on a page, jquery will be available as a global to all your modules and it will be extended with plugin1.

Now let's change our `main.js` file to:

```javascript
require("globals!jquery");

var obj = require("module1");
```
And let's add the following to `module1.js`:

```javascript
require("globals!jquery");
require("globals!jquery.plugin1");

module.exports = {};
```

When we run webpack `vendor.js` will look the same as before. Although jquery is included twice its code will only be present once in the generated file.

Now let's change our 'module1.js' to the following:

```javascript
require("globals?o=vendor2!jquery");
require("globals!jquery.plugin1");
require("globals?o=vendor2!jquery.plugin2");

module.exports = {};
```
Once again when we run webpack `vendor.js` will remain the same, but this time a `vendor2.js` will also be generated containing the code from `jquery` and `jquery.plugin2`. Notice that now both `vendor.js` and `vendor2.js` contain `jquery`. This behaviour may be changed later on if it doesn't prove useful.

## Support

If you find any problems with this loader just open a new issue and I'll try to look into it as soon as possible.


















