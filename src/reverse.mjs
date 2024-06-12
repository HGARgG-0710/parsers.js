export function SourceGenerator(generateMap) {
	const generator = (stream) => generateMap.index(stream.curr())(stream, generator)
	return function (stream, prevSource) {
		let result = prevSource
		while (!stream.isEnd()) {
			result = result.concat(generator(stream))
			stream.next()
		}
		return result
	}
}
