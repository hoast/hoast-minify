// If debug available require it.
let debug; try { debug = require(`debug`)(`hoast-minify/minifier`); } catch(error) { debug = function() {}; }
// Dependencies modules.
const CleanCSS =  require(`clean-css`),
	minifyHTML = require(`html-minifier`).minify,
	minifyJS = require(`terser`).minify;

const minifier = function(optionsCSS, optionsHTML, optionsJS) {
	// Ensure no promise is returned by Clean CSS.
	optionsCSS.returnPromise = false;
	// Initialize Clean CSS.
	const cleanCSS = new CleanCSS(optionsCSS);
	debug(`Clean CSS initialized`);
	
	// Create CSS minify function.
	const CSS = function(content, origin) {
		// Wrap inline and media CSS.
		switch (origin) {
			case `inline`:
				content = `*{${content}}`;
				break;
			case `media`:
				content = `@media ${content}{a{top:0}}`;
				break;
		}
		
		// Minify CSS.
		const result = cleanCSS.minify(content);
		
		// Check for errors.
		if (result.errors.length > 0) {
			// Log errors.
			result.errors.forEach(function(error) {
				debug(`CSS error: ${error}`);
			});
			// Return content as-is.
			return content;
		}
		// Overwrite content.
		content = result.styles;
		
		// Unwrap CSS.
		switch (origin) {
			case `inline`:
				return content.match(/^\*\{([\s\S]*)\}$/)[1] || content;
			case `media`:
				return content.match(/^@media ([\s\S]*?)\s*{[\s\S]*}$/)[1] || content;
		}
		return content;
	};
	
	// Create JS minify function.
	const JS = function(content) {
		const result = minifyJS(content, optionsJS);
		if (result.error) {
			debug(`JS error: ${result.error}`);
			return content;
		}
		return result.code;
	};
	
	// Set custom minifiers for HTML as well.
	optionsHTML.minifyCSS = CSS;
	optionsHTML.minifyJS = JS;
	
	// Create HTML minify function.
	const HTML = function(content) {
		return minifyHTML(content, optionsHTML);
	};
	
	// Return all minifiers.
	return {
		minifyCSS: CSS,
		minifyHTML: HTML,
		minifyJS: JS
	};
};

module.exports = minifier;