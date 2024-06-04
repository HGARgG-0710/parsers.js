export function SourceGenerator(generateTable, emptyVal = "") {
	return function (treeStream) {
		let result = emptyVal
		while (!treeStream.isEnd()) {
			result = result.concat(generateTable[type(treeStream.curr())](treeStream))
			treeStream.next()
		}
		return result
	}
}
