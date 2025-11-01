import type { Regex } from "../objects.js"
import type { IPeekableStream } from "./Stream.js"

export interface IRegexMatcher {
	match<T = any>(stream: IPeekableStream<T>): false | string | (string | T)[]
}

interface ICompositePartBuilder {
	addItem(item: Regex.Raw): void
}

export interface IConcreteRegexFinalizer {
	concrete(raw: Regex.Raw): IRegexMatcher
}

export interface IRegexPartBuilder extends ICompositePartBuilder {
	finish(): Regex.Raw
}
