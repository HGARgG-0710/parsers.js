import type { IPeekableStream } from "../interfaces.js"
import { RegexParser } from "../internal/RegexParser/Parser.js"

class RegexCompiler {
	private readonly parser = new RegexParser()

	compile(source: string) {
		this.parser.parse(source)
	}
}

export class Regex {
	private readonly compiler = new RegexCompiler()

	matchAt(stream: IPeekableStream): boolean {}

	constructor(source: string) {
		this.compiler.compile(source)
	}
}
