# PDF-JS-Vue

*"PJV" - A PDF viewer for the web, utilizing Vue.js and Mozilla's PDF.js*

## Background

Being able to open up a PDF in a webpage can have advantages to requiring a separate viewer for PDFs, especially on mobile devices. Given the intricacies of the PDF format, it's best to rely on a robust JavaScript library: Mozilla's **[PDF.js](https://github.com/mozilla/pdf.js)**. PDF.js is the defacto standard for reading PDFs with JavaScript, but its viewer is not modular and is not made to be imported into other web projects easily.

To build an extendable interface for viewing the PDF, **[Vue](https://vuejs.org/)** was selected because it is an easy-to-use, modern framework, and can be brought into other websites without much trouble. There are no Vue examples currently included with PDF.js, and [it is not something the team wants to add](https://github.com/mozilla/pdf.js/issues/14819), so this repo can act as an example for anyone wishing to combine Vue with PDF.js.


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
	- `pdf.worker.js` (PDF.js's worker)
	- If you're not using a build process then you'll also need to copy `pdf-js-vue.[X].js`, where "[X]" is the type of file you want, e.g. `cjs` (commonjs) or `esm` (ES Module).
	- You may want to copy them via an automated process (like Rollup's copy plugin or webpack's CopyPlugin)
3. Make sure you have a Vue `.js` file accessible, either in a scripts folder, or via a CDN (e.g., https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.33/vue.global.min.js)

### Generic Webpage / App

4. In your HTML, add an empty element to contain the PDF viewer, e.g., `<div id="pdf-viewer-container"></div>`. It's best if this is near the end of your HTML, which gives it a higher z-index by default.
5. Include the CSS `<link rel="stylesheet" href="path-to-your-styles/pdf-js-vue-viewer.css" />`. You should be able to easily override any of the styles as you see fit.
6. Include Vue - e.g., `<script src="path-to-your-vue/3.2.33/vue.global.min.js"></script>`
- Include pdfJsVue - *coming soon*
- Set up an event that triggers the opening of the PDF viewer - *coming soon*

### Vue App

- *coming soon*

## Room for Improvement

* Sadly Mozilla's PDF.js does not (as of 2022 April) support ESM Modular builds, nor does it seem to be on the horizon. So we are relying on another repo for this: https://github.com/bundled-es-modules/pdfjs-dist. This repo is not updated as frequently as Mozilla's repo, and is stuck several minor versions behind. It would be good to either make the bundled-es-modules repo so it can be easily updated ([see Issue](https://github.com/bundled-es-modules/pdfjs-dist/issues/24)), or make the PDF.js repo so it can be built with ESM ([something that is not a priority](https://github.com/mozilla/pdf.js/issues/10317)).
* Zooming:
	- Fix zooming so that it's the same increments despite `initialScale`
	- Allow zooming based on a drop-down.
	- Disable zooming buttons when reaching the min/max levels
* Other navbar tools:
	- Hand (movement)
	- Previous/Next Page buttons
	- First/Last Page buttons
	- Download
