import pdfJsLib from './pdf.js';
import pjvPageComponent from './pjvPageComponent.js';

const DELAY_MULTIPLIER = 50;

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
			pdf: null,
			pageVms: [],
			errorMessage: null,
		};
	},
	mounted() {
		// Need to configure the PDF.js library with the worker js path
		this.pdfJsLib.GlobalWorkerOptions.workerSrc = this.pdfJsWorkerSrc;
		this.loadPdf(this.pdfDocumentUrl); // async
		this.emitFilename();
	},
	methods: {
		async emitFilename() {
			await this.$nextTick();
			this.$emit('calculatedFilename', this.filename);
		},
		setPdf(pdf) {
			// We don't want Vue to turn this into a Proxy object or it will break some PDF.js
			// functionality, so we need to freeze it.
			this.pdf = Object.freeze(pdf);
		},
		async loadPdf(docUrlParam) {
			const hasUrlParam = Boolean(docUrlParam && typeof docUrlParam === 'string');
			const docUrl = (hasUrlParam) ? docUrlParam : this.pdfDocumentUrl;
			this.errorMessage = null;
			this.loading = true;
			// Enable a wait if you want to see the loading indicator
			// const wait = () => (new Promise((resolve) => window.setTimeout(resolve, 6000)));
			// await wait();
			try {
				const loadingTask = this.pdfJsLib.getDocument(docUrl);
				const pdf = await loadingTask.promise;
				this.setPdf(pdf);
			} catch (err) {
				console.error(err);
				this.errorMessage = String(err);
				this.pdf = null;
			}
			// Once we have the pdf object, we'll know the page count
			this.loading = false;
			return;
		},
	},
	computed: {
		filename() {
			if (!this.pdfJsLib || !this.pdfDocumentUrl) return null;
			return this.pdfJsLib.getFilenameFromUrl(this.pdfDocumentUrl);
		},
		scale() {
			// We're computing this in case we want to allow this scale to be overridden
			// within this component
			return this.initialScale || 1;
		},
		pageCount() {
			return (this.pdf && this.pdf.numPages) ? this.pdf.numPages : 0;
		},
		docViewerStateClass() {
			return {
				'pjv-doc-viewer--loading': this.loading,
			}
		},
	},
	components: {
		'pjv-page-component': pjvPageComponent,
	},
	template: (
		`<div class="pjv-doc-viewer" :class="docViewerStateClass">
			<div class="pjv-error" v-if="errorMessage">
				Error: {{errorMessage}}
				<br />
				<button type="button" @click="loadPdf">Retry</button>
			</div>
			<ol class="pjv-page-list">
				<li class="pjv-page-item" v-for="n in pageCount">
					<pjv-page-component
						:pageNumber="n"
						:scale="scale"
						:pdf="pdf"
						:delay="n * ${DELAY_MULTIPLIER}"
					></pjv-page-component>
				</li>
			</ol>
			<div class="pjv-doc-loading-spinner" v-if="loading">{{loadingText}}</div>
		</div>`
	),
};
