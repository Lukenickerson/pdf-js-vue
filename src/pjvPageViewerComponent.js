import pdfJsLib from './pdf.js';
import pjvPageComponent from './pjvPageComponent.js';

export default {
	props: {
		pdfJsWorkerSrc: String,
		pdfDocumentUrl: String,
		pdfJsLib: {
			type: Object,
			default: pdfJsLib,
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
