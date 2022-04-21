# PDF-JS-Vue

*"PJV" - A PDF viewer for the web, utilizing Vue.js and Mozilla's PDF.js*

## Background

Mozilla's **PDF.js** is the defacto standard for reading PDFs with JavaScript, but its viewer is not modular and is not made to be imported into other web projects easily. **Vue** is an easy-to-use, modern framework, and can be brought into other websites without much trouble.

## Try It Out

### On Your Local Machine

1. `git clone https://github.com/Lukenickerson/pdf-js-vue.git`
1. `cd pdf-js-vue`
1. `npm install`
1. `npm run serve` starts a development server (close with Ctrl+C). Pay attention to the URLs provided.
1. Go to `http://127.0.0.1:8080/examples` (or possibly a different port) in your browser

### Online

- ???

## Add It To Your Project

### Vanilla Webpage

- Copy the following files to the appropriate places:
	- pdf-js-vue-viewer.css
	- pdf-js-vue.global.js
	- pdf.worker.global.js
- In your HTML, add an element to contain the PDF viewer, e.g., `<div id="pdf-viewer-container"></div>`
- Include the CSS `<link rel="stylesheet" href="./path-to-your-styles/pdf-js-vue-viewer.css" />`
- ???

### Vue App

- `npm i git+https://github.com/Lukenickerson/pdf-js-vue.git`
- ???