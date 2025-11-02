import type { Regex } from "../objects.js"
import type { IPeekableStream } from "./Stream.js"

export interface IRegexMatcher {
	match<T = any>(stream: IPeekableStream<T>): false | string | (string | T)[]
}

export interface ICompositeRegexBuilder {
	addItem(item: Regex.Raw): this
}

export interface IConcreteRegexFinalizer {
	concrete(raw: Regex.Raw): IRegexMatcher
}

export interface IRegexPartBuilder extends ICompositeRegexBuilder {
	finish(): Regex.Raw
}
