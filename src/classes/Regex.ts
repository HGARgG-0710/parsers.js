import type { IPeekableStream } from "../interfaces.js"
import { RegexParser } from "../internal/RegexParser/Parser.js"

class RegexCompiler {
	private readonly parser = new RegexParser()

	// TODO: add an annotation for this...
	compile(source: string) {
		this.parser.parse(source)
	}
}

export class Regex {
	private readonly compiler = new RegexCompiler()

	matchAt(stream: IPeekableStream) {}

	constructor(source: string) {
		this.compiler.compile(source)
	}
}
