// Very rudimentary js code syntax highlighting

function convertCodeLinePartToHtml(sourceLinePart) {
	const firstCommentIndex = sourceLinePart.indexOf('//');
	const hasComment = (firstCommentIndex > -1);
	const classes = [];
	if (hasComment) classes.push('code-comment');
	return `<code class="${classes.join(' ')}">${sourceLinePart}</code>`;
}

function convertCodeLineToHtml(sourceLine) {
	const firstCommentIndex = sourceLine.indexOf('//');
	const hasComment = (firstCommentIndex > -1);
	const codeLinePart = (hasComment) ? sourceLine.substring(0, firstCommentIndex) : sourceLine;
	const commentLinePart = (hasComment) ? sourceLine.substring(firstCommentIndex) : '';
	return convertCodeLinePartToHtml(codeLinePart) + convertCodeLinePartToHtml(commentLinePart);
}

function convertCodeToHtml(sourceCode) {
	const sourceLines = sourceCode.split('\n');
	if (sourceLines[0].trim() === '') sourceLines.shift(); // Remove first line if its blank
	return sourceLines.map(convertCodeLineToHtml).join('<br/>');
}

function writeCode(sourceId, destId) {
	const sourceElement =  window.document.getElementById(sourceId);
	const sourceCode = sourceElement.innerHTML;
	const codeHtml = convertCodeToHtml(sourceCode); 
	window.document.getElementById(destId).innerHTML = codeHtml;
}

export { writeCode };
