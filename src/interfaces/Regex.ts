import type { Regex } from "../objects.js"
import type { IPeekableStream } from "./Stream.js"

export interface IRegexMatcher {
	match<T = any>(stream: IPeekableStream<T>): false | string | (string | T)[]
}

export interface ICompositeRegexBuilder {
	addItem(item: Regex.Raw): this
}

export interface IConcreteRegexFinalizer {
	toConcrete(raw: Regex.Raw): IRegexMatcher
}

export interface IRegexPartBuilder extends ICompositeRegexBuilder {
	finish(): Regex.Raw
}

export interface IRawRegexVisitor<T = any> {
	handleEither(either: Regex.Raw.Either): T
	handleCatenation(catenation: Regex.Raw.Catenation): T
	handleOptional(optional: Regex.Raw.Optional): T
	handleNoneOrMore(noneOrMore: Regex.Raw.NoneOrMore): T
	handleChar(char: Regex.Raw.Char): T
	handleTokenType(tokenType: Regex.Raw.TokenType): T
	handleCodeRange(codeRange: Regex.Raw.CodeRange): T
	handleAnything(anything: Regex.Raw.Anything): T
	handleNoneOf(noneOf: Regex.Raw.NoneOf): T
	handleNonGreedy(nonGreedy: Regex.Raw.NonGreedy): T
	handleIgnoreCase(ignoreCase: Regex.Raw.IgnoreCase): T
	handleNoCapture(noCapture: Regex.Raw.NoCapture): T
}
