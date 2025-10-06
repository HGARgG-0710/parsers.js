import type { IPeekableStream } from "../interfaces.js"
import { RegexStorage } from "../internal/RegexStorage.js"

export class Regex {
	// ! TYPE THIS - return type of `RegexCompiler.compile`;
	private readonly final

	matchAt(stream: IPeekableStream): false | string {
		return this.final.match(stream)
	}

	constructor(source: string) {
		this.final = RegexStorage.instance.get(source)
	}
}
