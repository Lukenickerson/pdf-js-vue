// const pdfJsLib = require('pdfjs-dist/build/pdf.js');
const CANVAS_ID = 'pdf-js-vue-canvas';

export default {
	props: {
		pageNumber: Number,
		scale: Number,
		pdf: Object, // Frozen object of type PDFDocumentProxy, from PDF.js
	},
	data() {
		return {
			loading: true,
			// page: null, // Needs to be of type PDFPageProxy, from PDF.js
			canvas: null,
			canvasContext: null,
			outputScale: window.devicePixelRatio || 1,
		};
	},
	methods: {
		getPageId(n) {
			return [CANVAS_ID, n].join('_');
		},
		async loadPage() {
			this.loading = true;
			// const loadingTask = pdfJsLib.getDocument('mozilla_pdf.js_github_2022-04-19.pdf');
			// const pdf = await loadingTask.promise;
			const page = await this.pdf.getPage(this.pageNumber);
			// Freeze the page to avoid Vue making this a Proxy object (PDF.js doesn't like that)
			// this.page = Object.freeze(page);
			await this.renderPage(page);
			this.loading = false;
		},
		setupCanvas() {
			this.canvas = window.document.getElementById(this.id);
			this.canvasContext = this.canvas.getContext('2d');
		},
		adjustCanvas(viewport) {
			const { canvas, outputScale } = this;
			canvas.width = Math.floor(viewport.width * outputScale);
			canvas.height = Math.floor(viewport.height * outputScale);
			canvas.style.width = Math.floor(viewport.width) + 'px';
			canvas.style.height = Math.floor(viewport.height) + 'px';
		},
		makeRenderContext(page) {
			const { canvasContext, scale, outputScale } = this;
			const viewport = page.getViewport({ scale });
			this.adjustCanvas(viewport);
			const transform = (outputScale !== 1) ? [outputScale, 0, 0, outputScale, 0, 0] : null;
			const renderContext = { canvasContext, transform, viewport };
			return renderContext;
		},
		async renderPage(page) {
			this.setupCanvas();
			const renderContext = this.makeRenderContext(page);
			const renderTask = page.render(renderContext);
			await renderTask.promise;
		},
	},
	mounted() {
		this.loadPage();
	},
	computed: {
		id() {
			return this.getPageId(this.pageNumber);
		},
		pageClass() {
			return {
				'pjv-page--loading': this.loading,
			}
		},
	},
	template: (
		`<div class="pjv-page" :class="pageClass">
			<canvas :id="id" class="pjv-page-canvas"></canvas>
		</div>`
	),
};