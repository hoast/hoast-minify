// If debug available require it.
let debug; try { debug = require(`debug`)(`hoast-minify`); } catch(error) { debug = function() {}; }
// Custom modules.
const minifiers = require(`./minifiers`);

/**
 * Minifies CSS, HTML, JS file content.
 * @param {Object} options The module options.
 */
module.exports = function(options) {
	debug(`Initializing module.`);
	
	options = Object.assign({
		css: {},
		html: {
			collapseWhitespace: true,
			removeComments: true
		},
		js: {},
		
		patternsCSS: [
			`*.css`
		],
		patternsHTML: [
			`*.html`
		],
		patternsJS: [
			`*.js`
		],
		
		patternOptions: {}
	}, options);
	
	// Get minifiers.
	const { minifyCSS, minifyHTML, minifyJS } = minifiers(options.css, options.html, options.js);
	
	const mod = async function(hoast, files) {
		debug(`Running module.`);
		// Loop through files.
		files.forEach(function(file) {
			debug(`Processing file '${file.path}'.`);
				
			// Check if read module has been used.
			if (file.content === null) {
				debug(`File content not set, read module needs to be called before this.`);
				return;
			}
			
			// Check if file content is text.
			if (file.content.type !== `string`) {
				debug(`File content not valid for processing.`);
				return;
			}
			
			// Check against glob patterns to decide which minifier to use, if any.
			if (hoast.helper.match(file.path, this.expressionsCSS, options.patternOptions.all)) {
				file.content.data = minifyCSS(file.content.data);
				debug(`File content minified as CSS.`);
				return;
			}
			if (hoast.helper.match(file.path, this.expressionsHTML, options.patternOptions.all)) {
				file.content.data = minifyHTML(file.content.data);
				debug(`File content minified as HTML.`);
				return;
			}
			if (hoast.helper.match(file.path, this.expressionsJS, options.patternOptions.all)) {
				file.content.data = minifyJS(file.content.data);
				debug(`File content minified as JS.`);
				return;
			}
			
			debug(`File content NOT minified since no pattern matched.`);
		}, mod);
	};
	
	mod.before = function(hoast) {
		// Parse glob patterns into regular expressions.
		if (options.patternsCSS) {
			this.expressionsCSS = hoast.helper.parse(options.patternsCSS, options.patternOptions, true);
			debug(`CSS patterns parsed into expressions: ${this.expressionsCSS}.`);
		}
		if (options.patternsHTML) {
			this.expressionsHTML = hoast.helper.parse(options.patternsHTML, options.patternOptions, true);
			debug(`HTML patterns parsed into expressions: ${this.expressionsHTML}.`);
		}
		if (options.patternsJS) {
			this.expressionsJS = hoast.helper.parse(options.patternsJS, options.patternOptions, true);
			debug(`JS patterns parsed into expressions: ${this.expressionsJS}.`);
		}
	};
	
	return mod;
};