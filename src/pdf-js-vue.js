import pdfOverlayViewerComponent from './pjvOverlayViewerComponent.js';

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

export { pdfJsVue, addViewerApp };
