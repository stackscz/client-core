import { each } from 'lodash';

export default function safeJSONStringify(input, maxDepth = 5) {
	let finalOutput;
	const refs = [];
	const refsPaths = [];

	function recursion(partialInput, path = '', depth = 0) {
		const output = {};
		let pPath;
		let refIdx;

		if (maxDepth && depth + 1 > maxDepth) {
			return `{depth over ${maxDepth}}`;
		}

		each(partialInput, (item, p) => {
			pPath = (path ? (`${path}.`) : '') + p;
			if (typeof partialInput[p] === 'function') {
				output[p] = '{function}';
			} else if (typeof partialInput[p] === 'object') {
				refIdx = refs.indexOf(partialInput[p]);

				if (refIdx !== -1) {
					output[p] = `{reference to ${refsPaths[refIdx]}}`;
				} else {
					refs.push(partialInput[p]);
					refsPaths.push(pPath);
					output[p] = recursion(partialInput[p], pPath, depth + 1);
				}
			} else {
				output[p] = partialInput[p];
			}
		});

		return output;
	}

	if (typeof input === 'object') {
		finalOutput = recursion(input);
	} else {
		finalOutput = input;
	}

	return JSON.stringify(finalOutput);
}
