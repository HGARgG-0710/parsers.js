import type { IPeekableStream } from "../interfaces.js"
import { RegexCompiler } from "../internal/RegexCompiler/Compiler.js"

export class Regex {
	private readonly compiler = new RegexCompiler()
	// ! TYPE THIS - return type of `RegexCompiler.compile`; 
	private readonly final

	matchAt(stream: IPeekableStream): false | string {
		return this.final.match(stream)
	}

	constructor(source: string) {
		this.final = this.compiler.compile(source)
	}
}
