import copy from 'rollup-plugin-copy';

const input = 'src/pdf-js-vue.js';
const plugins = [
	copy({
		targets: [
			{
				src: './node_modules/@bundled-es-modules/pdfjs-dist/build/pdf.worker.js',
				dest: './build/'
			},
			{
				src: './node_modules/vue/dist/vue.esm-browser.js',
				dest: './build/vue/'
			},
		],
	}),
];

export default [
	{
		input,
		output: {
			file: 'build/pdf-js-vue.cjs.js',
			format: 'cjs',
		},
		plugins,
	},
	{
		input,
		output: {
			file: 'build/pdf-js-vue.esm.js',
			format: 'es',
		},
		plugins,
	},
];
