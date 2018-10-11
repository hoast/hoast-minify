// If debug available require it.
let debug; try { debug = require(`debug`)(`hoast-minify`); } catch(error) { debug = function() {}; }
// Node modules.
const assert = require(`assert`);
// Dependency modules.
const parse = require(`planckmatch/parse`),
	match = require(`planckmatch/match`);
const minifiers = require(`./minifiers`);

/**
 * Validates the module options.
 * @param {Object} options The options.
 */
const validateOptions = function(options) {
	if (!options) {
		// Return since no option is required.
		return;
	}
	
	assert(
		typeof(options) === `object`,
		`hoast-minify: options must be of type object.`
	);
	
	/**
	 * Validate a potential array.
	 * @param {Object} property Name of property to validate.
	 * @param {String} type Object type.
	 */
	const validateArray = function(property, type) {
		property = options[property];
		const message = `hoast-minify: ${property} must be of type ${type} or an array of ${type}s.`;
		if (Array.isArray(property)) {
			property.forEach(function(item) {
				assert(
					typeof(item) === type,
					message
				);
			});
		} else {
			assert(
				typeof(property) === type,
				message
			);
		}
	};
	
	if (options.css) {
		assert(
			typeof(options.css) === `object`,
			`hoast-minify: css must be of type object.`
		);
	}
	if (options.html) {
		assert(
			typeof(options.html) === `object`,
			`hoast-minify: html must be of type object.`
		);
	}
	if (options.js) {
		assert(
			typeof(options.js) === `object`,
			`hoast-minify: js must be of type object.`
		);
	}
	
	if (options.patternsCSS) {
		validateArray(`patternsCSS`, `string`);
	}
	if (options.patternsHTML) {
		validateArray(`patternsHTML`, `string`);
	}
	if (options.patternsJS) {
		validateArray(`patternsJS`, `string`);
	}
	if (options.patternOptions) {
		assert(
			typeof(options.patternOptions) === `object`,
			`hoast-minify: patternOptions must be of type object.`
		);
		if (options.patternOptions.all) {
			assert(
				typeof(options.patternOptions.all) === `boolean`,
				`hoast-minify: patternOptions.all must be of type boolean.`
			);
		}
	}
};

/**
 * Check if expressions match with the given value.
 * @param {String} value The string to match with the expressions.
 * @param {RegExp|Array} expressions The regular expressions to match with.
 * @param {Boolean} all Whether all patterns need to match.
 */
const isMatch = function(value, expressions, all) {
	// If no expressions return early as valid.
	if (!expressions) {
		return true;
	}
	
	const result = match(value, expressions);
	
	// If results is an array.
	if (Array.isArray(result)) {
		// Check whether all or just any will result in a match, and return the outcome.
		return all ? !result.includes(false) : result.includes(true);
	}
	
	// Otherwise result is a boolean and can be returned directly.
	return result;
};

/**
 * Minifies CSS, HTML, JS file content.
 * @param {Object} options The module options.
 */
module.exports = function(options) {
	debug(`Initializing module.`);
	
	validateOptions(options);
	debug(`Validated options.`);
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
			assert(
				file.content !== null,
				`hoast-minify: No content found on file, read module needs to be called before this.`
			);
			
			// Check if file content is text.
			if (file.content.type !== `string`) {
				debug(`File content not valid for processing.`);
				return;
			}
			
			// Check against glob patterns to decide which minifier to use, if any.
			if (isMatch(file.path, this.expressionsCSS, options.patternOptions.all)) {
				file.content.data = minifyCSS(file.content.data);
				debug(`File content minified as CSS.`);
				return;
			}
			if (isMatch(file.path, this.expressionsHTML, options.patternOptions.all)) {
				file.content.data = minifyHTML(file.content.data);
				debug(`File content minified as HTML.`);
				return;
			}
			if (isMatch(file.path, this.expressionsJS, options.patternOptions.all)) {
				file.content.data = minifyJS(file.content.data);
				debug(`File content minified as JS.`);
				return;
			}
			
			debug(`File content NOT minified since no pattern matched.`);
		}, mod);
	};
	
	// Parse glob patterns into regular expressions.
	if (options.patternsCSS) {
		mod.expressionsCSS = parse(options.patternsCSS, options.patternOptions, true);
		debug(`CSS patterns parsed into expressions: ${mod.expressionsCSS}.`);
	}
	if (options.patternsHTML) {
		mod.expressionsHTML = parse(options.patternsHTML, options.patternOptions, true);
		debug(`HTML patterns parsed into expressions: ${mod.expressionsHTML}.`);
	}
	if (options.patternsJS) {
		mod.expressionsJS = parse(options.patternsJS, options.patternOptions, true);
		debug(`JS patterns parsed into expressions: ${mod.expressionsJS}.`);
	}
	
	return mod;
};