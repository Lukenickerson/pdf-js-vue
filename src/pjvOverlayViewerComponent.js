const pdfPageViewerComponent = require('./pjvPageViewerComponent.js');

module.exports = {
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
