import copy from 'rollup-plugin-copy';

const input = 'src/pdf-js-vue.js';
const external = ['@bundled-es-modules/pdfjs-dist'];
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
const cjsConfig = {
	input,
	output: {
		file: 'build/pdf-js-vue.cjs.js',
		format: 'cjs',
	},
	external,
	plugins,
};
const esmConfig = {
	...cjsConfig,
	output: {
		file: 'build/pdf-js-vue.esm.js',
		format: 'es',
	},
}

export default [cjsConfig, esmConfig];
