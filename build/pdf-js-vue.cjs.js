'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pdfJsLib = require('@bundled-es-modules/pdfjs-dist/build/pdf.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var pdfJsLib__default = /*#__PURE__*/_interopDefaultLegacy(pdfJsLib);

// const pdfJsLib = require('pdfjs-dist/build/pdf.js');
const CANVAS_ID = 'pdf-js-vue-canvas';

var pjvPageComponent = {
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

var pdfPageViewerComponent = {
	props: {
		pdfJsWorkerSrc: String,
		pdfDocumentUrl: String,
		pdfJsLib: {
			type: Object,
			default: pdfJsLib__default["default"],
		},
		loadingText: {
			type: String,
			default: 'Loading...',
		},
		initialScale: Number,
	},
	data() {
		return {
			loading: true,
			canvasContext: null,
			renderContext: null,
			scale: this.initialScale || 1.2,
			pdf: null,
			pageVms: [],
		};
	},
	mounted() {
		// Need to configure the PDF.js library with the worker js path
		this.pdfJsLib.GlobalWorkerOptions.workerSrc = this.pdfJsWorkerSrc;
		this.loadPdf(this.pdfDocumentUrl); // async
	},
	methods: {
		async loadPdf(docUrl) {
			this.loading = true;
			// Enable a wait if you want to see the loading indicator
			// const wait = () => (new Promise((resolve) => window.setTimeout(resolve, 6000)));
			// await wait();
			const loadingTask = this.pdfJsLib.getDocument(docUrl);
			const pdf = await loadingTask.promise;
			// We don't want Vue to turn this into a Proxy object or it will break some PDF.js
			// functionality, so we need to freeze it.
			this.pdf = Object.freeze(pdf);
			// Once we have the pdf object, we'll know the page count
			this.loading = false;
			return;
		},
	},
	computed: {
		// TODO: Pass filename back to the overlayviewer for display in the navbar
		// filename() {
		// 	if (!this.pdfJsLib || !this.pdfDocumentUrl) return 'Unknown';
		// 	return this.pdfJsLib.getFilenameFromUrl(this.pdfDocumentUrl);
		// },
		pageCount() {
			return (this.pdf && this.pdf.numPages) ? this.pdf.numPages : 0;
		},
		pageViewerStateClass() {
			return {
				'pjv-page-viewer--loading': this.loading,
			}
		},
	},
	components: {
		'pjv-page-component': pjvPageComponent,
	},
	template: (
		`<div class="pjv-page-viewer" :class="pageViewerStateClass">
			<div>
				<ol class="pjv-page-list">
					<li class="pjv-page-item" v-for="n in pageCount">
						<pjv-page-component
							:pageNumber="n"
							:scale="scale"
							:pdf="pdf"
						></pjv-page-component>
					</li>
				</ol>
				<div class="pjv-page-loading-spinner" v-if="loading">{{loadingText}}</div>
			</div>
		</div>`
	),
};

var pdfOverlayViewerComponent = {
	props: {
		pdfJsWorkerSrc: String,
		pdfDocumentUrl: String,
		initialOpen: {
			type: Boolean,
			default: true,
		},
		initialBackButtonText: String,
		initialCloseButtonText: String,
		overlayClickClose: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			pageViewerProps: {
				pdfJsWorkerSrc: this.pdfJsWorkerSrc,
				pdfDocumentUrl: this.pdfDocumentUrl,
			},
			open: this.initialOpen,
			loading: true,
			backButtonText: this.initialBackButtonText || '🡠',
			closeButtonText: this.initialCloseButtonText || '✕',
		};
	},
	methods: {
		toggleOpen() {
			this.open = !this.open;
		},
		overlayClick() {
			if (this.overlayClickClose) this.toggleOpen();
		}
	},
	computed: {
		overlayViewerClass() {
			return {
				'pjv-overlay-viewer-container--closed': !this.open,
				'pjv-overlay-viewer-container--loading': this.loading,
			};
		},
	},
	mounted() {
		window.setTimeout(() => this.loading = false, 1);
	},
	components: {
		'pdf-page-viewer-component': pdfPageViewerComponent,
	},
	template: (
		`<div class="pjv-overlay-viewer-container" :class="overlayViewerClass">
			<div class="pjv-overlay" @click="overlayClick"></div>
			<div class="pjv-viewer-container">
				<div class="pjv-navbar">
					<button type="button" class="pjv-navbar-button"
						@click="toggleOpen">
						{{backButtonText}}
					</button>
					<button type="button" class="pjv-navbar-button"
						@click="toggleOpen">
						{{closeButtonText}}
					</button>
				</div>
				<pdf-page-viewer-component v-bind="pageViewerProps"></pdf-page-viewer-component>
			</div>
		</div>`
	),
};

function addViewerApp(options = {}) {
	const { vue, mountId, pdfJsWorkerSrc, pdfDocumentUrl } = options;
	if (!vue) throw new Error('vue is required');
	if (!mountId) throw new Error('mountId is required');
	const appOptions = {
		components: {
			'pdf-overlay-viewer-component': pdfOverlayViewerComponent,
		},
		template: (
			`<pdf-overlay-viewer-component v-bind="viewerProps"></pdf-overlay-viewer-component>`
		),
		data() {
			return {
				viewerProps: {
					pdfJsWorkerSrc,
					pdfDocumentUrl,
				},
			};
		}
	};
	const app = vue.createApp(appOptions);
	app.mount(`#${mountId}`);
}

const pdfJsVue = { addViewerApp };

exports.addViewerApp = addViewerApp;
exports.pdfJsVue = pdfJsVue;
