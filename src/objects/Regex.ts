import type { IPeekableStream, IRegexBuilder, IRegexMatcher } from "../interfaces.js"
import { RegexStorage } from "../internal/RegexStorage.js"

export class Regex<T = any> {
	private readonly final: IRegexMatcher<T>

	matchAt(stream: IPeekableStream<T>): false | string {
		return this.final.match(stream)
	}

	constructor(source: string, builder: IRegexBuilder) {
		this.final = RegexStorage.instance.get(source, builder)
	}
}
