import type { IValidNodeType } from "./Node.js"
import type { IPeekableStream } from "./Stream.js"

export interface IRegexMatcher<T = any> {
	match(stream: IPeekableStream<T>): false | string
}

interface IPrePartBuilder {
	begin(): void
	// TODO: ADD THE TYPE for the `item` argument...
	addItem(item): void
}

export interface IRegexBuilder<T = any> extends IPrePartBuilder {
	readonly disjunction: IRegexPartBuilder
	readonly catenation: IRegexPartBuilder
	readonly ignoreCase: IRegexPartBuilder
	readonly lookahead: IRegexPartBuilder
	readonly charClass: IRegexPartBuilder
	readonly negCharClass: IRegexPartBuilder

	// TODO: *add* the return types...
	anyChar(): any
	word(): any
	digit(): any
	space(): any
	// ! CRUCIAL REMINDER - `.newline()` includes the handling of '\r\n', FOR CROSS-PLATFORM REASONS!
	newline(): any
	literal(x: string): any
	charRange(from: string, to: string): any
	unicodeChar(hex: string): any
	typeMatch(type: IValidNodeType): any

	finalize(): IRegexMatcher<T>
}

export interface IRegexPartBuilder extends IPrePartBuilder {
	begin(): void

	// TODO: add types for this! what is the `item`??? what is the return type of `finish()`???
	// * THIS SHOULD BE THE SAME as `addItem`, or related...
	finish(): any
}
