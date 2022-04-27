import docViewerComponent from './pjvDocViewerComponent.js';

const ZOOM_100 = 1.2; // Scale for "100%"
const MIN_ZOOM_LEVEL = -5;
const MAX_ZOOM_LEVEL = 10;
const MAX_SCALE = 0.01;
/*
TODO: Allow zoom by drop-down? Like https://mozilla.github.io/pdf.js/web/viewer.html
const ZOOM_SCALES = [
	.1,
	// Scale by 0.17
	.17,
	.33,
	.5,
	.67,
	.83,
	1,
	1.17,
	1.33,
	1.5,
	// Different scales
	1.75,
	2,
	2.5,
	3,
	4,
	5,
];
*/
const DEFAULT_NAV_CONFIG = {
	back: {
		show: true,
		text: '🡠',
	},
	zoom: {
		show: true,
	},
	title: {
		show: true,
	},
	close: {
		show: true,
		text: '✕',
	},
};

export default {
	props: {
		pdfJsWorkerSrc: String,
		pdfDocumentUrl: String,
		initialOpen: {
			type: Boolean,
			default: true,
		},
		navConfig: {
			type: Object,
			default: DEFAULT_NAV_CONFIG,
		},
		overlayClickClose: {
			type: Boolean,
			default: true,
		},
		initialScale: {
			type: Number,
			default: ZOOM_100,
		},
		zoomIncrement: {
			type: Number,
			default: 0.2,
		},
	},
	data() {
		const navConfig = this.getNavConfigWithDefaults();
		return {
			open: this.initialOpen,
			loading: true,
			title: null,
			backButtonText: navConfig.back.text,
			showBackButton: navConfig.back.show,
			closeButtonText: navConfig.close.text,
			showCloseButton: navConfig.close.show,
			showZoom: navConfig.zoom.show,
			showTitle: navConfig.title.show,
			zoomLevel: 0,
		};
	},
	methods: {
		getNavConfigWithDefaults() {
			const navConfig = {};
			Object.keys(DEFAULT_NAV_CONFIG).forEach((key) => {
				const options = this.navConfig[key] || {};
				navConfig[key] = {
					...DEFAULT_NAV_CONFIG[key],
					...options,
				};
			});
			return navConfig;
		},
		toggleOpen() {
			this.open = !this.open;
		},
		overlayClick() {
			if (this.overlayClickClose) this.toggleOpen();
		},
		zoomIn() {
			this.zoomLevel = Math.min(this.zoomLevel + 1, MAX_ZOOM_LEVEL);
		},
		zoomOut() {
			this.zoomLevel = Math.max(this.zoomLevel - 1, MIN_ZOOM_LEVEL);
		},
		displayTitle(title) {
			if (!this.showTitle) return;
			this.title = title;
		},
	},
	computed: {
		overlayViewerClass() {
			return {
				'pjv-overlay-viewer-container--closed': !this.open,
				'pjv-overlay-viewer-container--loading': this.loading,
			};
		},
		scale() {
			return Math.max(
				MAX_SCALE,
				this.initialScale + (this.zoomIncrement * this.zoomLevel)
			);
		},
		zoomPercent() {
			return Math.round(100 * (this.scale / this.initialScale));
		},
		docViewerProps() {
			return {
				pdfJsWorkerSrc: this.pdfJsWorkerSrc,
				pdfDocumentUrl: this.pdfDocumentUrl,
				initialScale: this.scale,
			};
		},
	},
	mounted() {
		window.setTimeout(() => this.loading = false, 1);
	},
	components: {
		'pjv-doc-viewer-component': docViewerComponent,
	},
	template: (
		`<article class="pjv-overlay-viewer-container" :class="overlayViewerClass">
			<div class="pjv-overlay" @click="overlayClick"></div>
			<div class="pjv-viewer-container">
				<nav class="pjv-navbar">
					<div class="pjv-navbar-group">
						<button type="button"
							class="pjv-navbar-button pjv-navbar-back-button"
							v-if="showBackButton"
							@click="toggleOpen">
							{{backButtonText}}
						</button>
					</div>
					<div class="pjv-navbar-group pjv-navbar-title"
						v-if="showTitle && title">
						{{title}}
					</div>
					<div class="pjv-navbar-group pjv-navbar-zoom-group"
						v-if="showZoom">
						<button type="button"
							class="pjv-navbar-button pjv-navbar-zoom-out-button"
							@click="zoomOut">
							-
						</button>
						<button type="button"
							class="pjv-navbar-button pjv-navbar-zoom-in-button"
							@click="zoomIn">
							+
						</button>
						<div>
							{{zoomPercent}}%
						</div>
					</div>
					<div class="pjv-navbar-group">
						<button type="button"
							class="pjv-navbar-button pjv-navbar-close-button"
							v-if="showCloseButton"
							@click="toggleOpen">
							{{closeButtonText}}
						</button>
					</div>
				</nav>
				<pjv-doc-viewer-component
					v-bind="docViewerProps"
					@calculated-filename="displayTitle"
				></pjv-doc-viewer-component>
			</div>
		</article>`
	),
};
