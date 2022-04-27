// const pdfJsLib = require('pdfjs-dist/build/pdf.js');
const CANVAS_ID = 'pdf-js-vue-canvas';

export default {
	props: {
		pageNumber: Number,
		scale: Number,
		pdf: Object, // Frozen object of type PDFDocumentProxy, from PDF.js
		delay: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			loading: true,
			pdfValues: { // Store PDF.js objects in this object to preserve their class types
				page: null, // Needs to be of type PDFPageProxy, from PDF.js
			},
			viewport: null, // type PageViewport from PDF.js - OK if this becomes a Proxy?
			outputScale: window.devicePixelRatio || 1,
			errorMessage: null,
			errorCount: 0,
		};
	},
	watch: {
		scale() {
			// this.setViewport();
			this.renderPage();
		},
	},
	methods: {
		wait(ms) {
			return new Promise((resolve) => window.setTimeout(resolve, ms));
		},
		getPageId(n) {
			return [CANVAS_ID, n].join('_');
		},
		setPage(page) {
			this.pdfValues.page = page;
			this.setViewport();
		},
		setViewport() {
			const { scale, pdfValues } = this;
			const viewport = pdfValues.page.getViewport({ scale });
			this.viewport = viewport;
		},
		async loadPage() {
			if (this.errorCount > 10) return; // Safety measure
			this.errorMessage = null;
			this.loading = true;
			try {
				const page = await this.pdf.getPage(this.pageNumber);
				this.setPage(page);
				if (this.delay) await this.wait(this.delay);
				await this.renderPage();
			} catch (err) {
				console.error(err);
				this.errorCount += 1;
				this.errorMessage = String(err);
			}
			this.loading = false;
		},
		async renderPage() {
			if (this.errorCount > 10) return; // Safety measure
			try {
				const page = this.pdfValues.page;
				const renderTask = page.render(this.renderContext);
				await renderTask.promise;
			} catch (err) {
				this.errorCount += 1;
				console.error('PDF page render failed', err);
			}
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
			};
		},
		renderContext() {
			const canvas = window.document.getElementById(this.id);
			const canvasContext = canvas.getContext('2d');
			this.setViewport(this.scale);
			const { outputScale, viewport } = this;
			const transform = (outputScale !== 1) ? [outputScale, 0, 0, outputScale, 0, 0] : null;
			const renderContext = { canvasContext, transform, viewport };
			return renderContext;
		},
		canvasStyle() {
			const getViewportStyleValue = (key) => {
				const n = (this.viewport) ? this.viewport[key] : 0;
				return `${n}px`;
			};
			return {
				width: getViewportStyleValue('width'),
				height: getViewportStyleValue('height'),
			};
		},
		canvasWidth() {
			if (!this.viewport) return 0;
			return Math.floor(this.viewport.width * this.outputScale);
		},
		canvasHeight() {
			if (!this.viewport) return 0;
			return Math.floor(this.viewport.height * this.outputScale);
		},
	},
	template: (
		`<div class="pjv-page" :class="pageClass">
			<div class="pjv-error" v-if="errorMessage">Error: {{errorMessage}}</div>
			<canvas
				:id="id"
				class="pjv-page-canvas"
				:style="canvasStyle"
				:width="canvasWidth"
				:height="canvasHeight"
			></canvas>
		</div>`
	),
};
