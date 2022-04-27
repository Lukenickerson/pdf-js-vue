import pdfOverlayViewerComponent from './pjvOverlayViewerComponent.js';

function makeOverlayViewerProps(options = {}) {
	const { pdfJsWorkerSrc, pdfDocumentUrl } = options;
	if (!pdfJsWorkerSrc) console.warn('No pdfJsWorkerSrc param was provided. This will likely cause an error when opening PDFs.');
	if (!pdfDocumentUrl) console.warn('No pdfDocumentUrl param was provided.');
	const overlayViewerProps = { pdfJsWorkerSrc, pdfDocumentUrl };
	const optionsParams = [
		'navConfig', 'overlayClickClose', 'initialOpen', 'initialScale', 'zoomIncrement',
	];
	optionsParams.forEach((key) => {
		if (options[key]) overlayViewerProps[key] = options[key];
	});
	console.log(overlayViewerProps)
	return overlayViewerProps;
}

function mountApp(app, mountId, addMountElement) {
	// If the mount/container element doesn't exist, let's create it at the end of the body
	if (addMountElement && window && window.document && !window.document.getElementById(mountId)) {
		const mountElt = window.document.createElement('div');
		mountElt.id = mountId;
		const body = window.document.getElementsByTagName('body')[0];
		body.appendChild(mountElt);
	}
	app.mount(`#${mountId}`);
}

function addViewerApp(options = {}) {
	const { vue, mountId, addMountElement } = options;
	if (!vue) throw new Error('vue is required');
	if (!mountId) throw new Error('mountId is required');
	const appOptions = {
		components: {
			'pdf-overlay-viewer-component': pdfOverlayViewerComponent,
		},
		template: (
			`<pdf-overlay-viewer-component v-bind="overlayViewerProps"></pdf-overlay-viewer-component>`
		),
		data() {
			return {
				overlayViewerProps: makeOverlayViewerProps(options),
			};
		}
	};
	const app = vue.createApp(appOptions);
	mountApp(app, mountId, addMountElement);
}

const pdfJsVue = { addViewerApp };

export { pdfJsVue, addViewerApp };
