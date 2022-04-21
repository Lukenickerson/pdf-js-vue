const webpack = require("webpack"); // eslint-disable-line no-unused-vars
const path = require("path");

module.exports = [
	/*
	{
		experiments: {
			outputModule: true,
		},
		context: __dirname,
		entry: {
			main: "./main.js",
			"pdf.worker": "pdfjs-dist/build/pdf.worker.entry",
		},
		mode: "none",
		output: {
			library: {
				// name: 'z',
				type: 'global',
			},
			// libraryExport: 'default',
			// libraryTarget: 'global', // 'global', 'window', 'this', etc.
			
			path: path.join(__dirname, "./build"),
			publicPath: "./build/",
			filename: "[name].global.js",
		},
	},
	*/
	{
		context: __dirname,
		entry: {
			'pdf-js-vue': './src/pdf-js-vue.js',
			'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry',
			// 'vue': './src/vue.js',
		},
		mode: 'none',
		output: {
			library: {
				type: 'global',
			},
			path: path.join(__dirname, "./build"),
			publicPath: "./build/",
			filename: "[name].global.js",
		},
	},
	// {
	// 	context: __dirname,
	// 	entry: {
	// 		'sample': './example/sample-src.mjs'
	// 	},
	// 	mode: 'none',
	// 	output: {
	// 		library: {
	// 			type: 'window',
	// 		},
	// 		path: path.join(__dirname, "./example"),
	// 		publicPath: "./example/",
	// 		filename: "[name]-build.window.js",
	// 	},
	// },
];
