# PDF-JS-Vue

*"PJV" - A PDF viewer for the web, utilizing Vue.js and Mozilla's PDF.js*

## Background

Mozilla's **PDF.js** is the defacto standard for reading PDFs with JavaScript, but its viewer is not modular and is not made to be imported into other web projects easily. **Vue** is an easy-to-use, modern framework, and can be brought into other websites without much trouble.


## Try It Out

### Online

- Go to https://lukenickerson.github.io/pdf-js-vue/examples/

### On Your Local Machine

You'll need npm and git installed.

1. `git clone https://github.com/Lukenickerson/pdf-js-vue.git`
1. `cd pdf-js-vue`
1. `npm install`
1. `npm run serve` starts a development server.. Pay attention to the URLs provided.
1. Go to `http://127.0.0.1:8080/examples` (or possibly a different port) in your browser
1. Close development server with <kbd>Ctrl</kbd>+<kbd>C</kbd>


## Add It To Your Project

1. `npm i git+https://github.com/Lukenickerson/pdf-js-vue.git`
2. Copy these files to the appropriate places:
	- `pdf-js-vue-viewer.css` (includes base styles prefixed with `pjv-`)
	- `pdf.worker.global.js` (PDF.js's worker)
	- If you're not using a build process, then you'll also need to copy `pdf-js-vue.global.js`
	- You may want to copy them via an automated process (like webpack's CopyPlugin)

### Vanilla Webpage

- In your HTML, add an element to contain the PDF viewer, e.g., `<div id="pdf-viewer-container"></div>`
- Include the CSS `<link rel="stylesheet" href="./path-to-your-styles/pdf-js-vue-viewer.css" />`
- *coming soon*

### Vue App

- *coming soon*
