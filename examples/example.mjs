// Importing pdf-js-vue.global.js puts pdfJsVue on the global scope
import '../build/pdf-js-vue.global.js';
// This example assumes you're bringing your own Vue. Only createApp is needed.
import { createApp } from '../node_modules/vue/dist/vue.esm-browser.js';

const vue = { createApp };
// Need to specify where to put the app in the DOM
const mountId = 'example-pdf-js-vue-container';
// Need to specify where the PDF worker javascript file is
// (Could also use '../node_modules/pdfjs-dist/build/pdf.worker.js')
const pdfJsWorkerSrc = '../build/pdf.worker.global.js';

// Open a PDF by adding the "Viewer" vue app
function openPdf(pdfDocumentUrl) {
	pdfJsVue.addViewerApp({ vue, mountId, pdfJsWorkerSrc, pdfDocumentUrl });
}
// Allow opening of PDFs by clicking buttons
window.document.addEventListener('click', (e) => {
	if (e.target.dataset.pdfsrc) openPdf(e.target.dataset.pdfsrc);
});
