export function SourceGenerator(generateMap) {
	return function (stream, prevSource) {
		let result = prevSource
		while (!stream.isEnd()) {
			result = result.concat(generateMap.index(stream.curr())(stream))
			stream.next()
		}
		return result
	}
}
