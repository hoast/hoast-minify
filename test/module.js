// Dependency modules.
const test = require(`ava`);
// Custom module.
const Minify = require(`../library`);

test(`options default`, async function(t) {
	// Create dummy files.
	const files = [{
		path: `a.txt`,
		content: {
			type: `string`,
			data: ` <html> <body> <h1>Hello World!</h1> </body> </html> `
		}
	}];
	
	// Expected outcome.
	const filesOutcome = [{
		path: `a.txt`,
		content: {
			type: `string`,
			data: ` <html> <body> <h1>Hello World!</h1> </body> </html> `
		}
	}];
	
	// Test module.
	const minify = Minify();
	await minify({}, files);
	// Compare files.
	t.deepEqual(files, filesOutcome);
});

test(`options patterns`, async function(t) {
	// Create dummy files.
	const files = [{
		path: `a.txt`,
		content: {
			type: `string`,
			data: ` body { color: #fff; background-color: #000; } h1 { font-size: 16px; } `
		}
	}, {
		path: `b.css`,
		content: {
			type: `string`,
			data: ` body { color: #fff; background-color: #000; } h1 { font-size: 16px; } `
		}
	}, {
		path: `b.bcss`,
		content: {
			type: `string`,
			data: ` body { color: #fff; background-color: #000; } h1 { font-size: 16px; } `
		}
	}];
	
	// Expected outcome.
	const filesOutcome = [{
		path: `a.txt`,
		content: {
			type: `string`,
			data: ` body { color: #fff; background-color: #000; } h1 { font-size: 16px; } `
		}
	}, {
		path: `b.css`,
		content: {
			type: `string`,
			data: ` body { color: #fff; background-color: #000; } h1 { font-size: 16px; } `
		}
	}, {
		path: `b.bcss`,
		content: {
			type: `string`,
			data: `body{color:#fff;background-color:#000}h1{font-size:16px}`
		}
	}];
	
	// Test module.
	const minify = Minify({
		patternsCSS: [
			`*.bcss`
		]
	});
	await minify({}, files);
	// Compare files.
	t.deepEqual(files, filesOutcome);
});

test(`CSS`, async function(t) {
	// Create dummy files.
	const files = [{
		path: `b.css`,
		content: {
			type: `string`,
			data: ` body { color: #fff; background-color: #000; } h1 { font-size: 16px; } `
		}
	}];
	
	// Expected outcome.
	const filesOutcome = [{
		path: `b.css`,
		content: {
			type: `string`,
			data: `body{color:#fff;background-color:#000}h1{font-size:16px}`
		}
	}];
	
	// Test module.
	const minify = Minify();
	await minify({}, files);
	// Compare files.
	t.deepEqual(files, filesOutcome);
});

test(`HTML`, async function(t) {
	// Create dummy files.
	const files = [{
		path: `c.html`,
		content: {
			type: `string`,
			data: ` <html> <body> <h1>Hello World!</h1> </body> </html>`
		}
	}];
	
	// Expected outcome.
	const filesOutcome = [{
		path: `c.html`,
		content: {
			type: `string`,
			data: `<html><body><h1>Hello World!</h1></body></html>`
		}
	}];
	
	// Test module.
	const minify = Minify();
	await minify({}, files);
	// Compare files.
	t.deepEqual(files, filesOutcome);
});

test(`HTML CSS inline`, async function(t) {
	// Create dummy files.
	const files = [{
		path: `c.html`,
		content: {
			type: `string`,
			data: ` <html> <body> <h1 style=" color: #fff; font-size: 16px; ">Hello World!</h1> </body> </html> `
		}
	}];
	
	// Expected outcome.
	const filesOutcome = [{
		path: `c.html`,
		content: {
			type: `string`,
			data: `<html><body><h1 style="color:#fff;font-size:16px">Hello World!</h1></body></html>`
		}
	}];
	
	// Test module.
	const minify = Minify();
	await minify({}, files);
	// Compare files.
	t.deepEqual(files, filesOutcome);
});

test(`HTML CSS tag`, async function(t) {
	// Create dummy files.
	const files = [{
		path: `c.html`,
		content: {
			type: `string`,
			data: ` <html> <head> <style> body { color: #fff; background-color: #000; } h1 { font-size: 16px; } </style> </head> </html> `
		}
	}];
	
	// Expected outcome.
	const filesOutcome = [{
		path: `c.html`,
		content: {
			type: `string`,
			data: `<html><head><style>body{color:#fff;background-color:#000}h1{font-size:16px}</style></head></html>`
		}
	}];
	
	// Test module.
	const minify = Minify();
	await minify({}, files);
	// Compare files.
	t.deepEqual(files, filesOutcome);
});

test(`HTML JS tag`, async function(t) {
	// Create dummy files.
	const files = [{
		path: `c.html`,
		content: {
			type: `string`,
			data: ` <html> <body> <script> const a = "test text"; let b = a + " more"; </script> </body> </html> `
		}
	}];
	
	// Expected outcome.
	const filesOutcome = [{
		path: `c.html`,
		content: {
			type: `string`,
			data: `<html><body><script>const a="test text";let b=a+" more";</script></body></html>`
		}
	}];
	
	// Test module.
	const minify = Minify();
	await minify({}, files);
	// Compare files.
	t.deepEqual(files, filesOutcome);
});

test(`JS`, async function(t) {
	// Create dummy files.
	const files = [{
		path: `d.js`,
		content: {
			type: `string`,
			data: ` const a = "test text"; let b = a + " more"; `
		}
	}];
	
	// Expected outcome.
	const filesOutcome = [{
		path: `d.js`,
		content: {
			type: `string`,
			data: `const a="test text";let b=a+" more";`
		}
	}];
	
	// Test module.
	const minify = Minify();
	await minify({}, files);
	// Compare files.
	t.deepEqual(files, filesOutcome);
});