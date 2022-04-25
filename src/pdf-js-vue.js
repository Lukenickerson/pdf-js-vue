import pdfOverlayViewerComponent from './pjvOverlayViewerComponent.js';

function addViewerApp(options = {}) {
	const { vue, mountId, pdfJsWorkerSrc, pdfDocumentUrl, addMountElement } = options;
	if (!vue) throw new Error('vue is required');
	if (!mountId) throw new Error('mountId is required');
	if (!pdfJsWorkerSrc) console.warn('No pdfJsWorkerSrc param was provided. This will likely cause an error when opening PDFs.');
	if (!pdfDocumentUrl) console.warn('No pdfDocumentUrl param was provided.');
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
	// If the mount/container element doesn't exist, let's create it at the end of the body
	if (addMountElement && window && window.document && !window.document.getElementById(mountId)) {
		const mountElt = window.document.createElement('div');
		mountElt.id = mountId;
		const body = window.document.getElementsByTagName('body')[0];
		body.appendChild(mountElt);
	}
	app.mount(`#${mountId}`);
}

const pdfJsVue = { addViewerApp };

export { pdfJsVue, addViewerApp };
