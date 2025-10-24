import type { IPeekableStream } from "./Stream.js"

export interface IRegexMatcher<T = any> {
	match(stream: IPeekableStream<T>): false | string
}

export interface IRegexBuilder<T = any> {
	readonly disjunction: IRegexPartBuilder
	readonly catenation: IRegexPartBuilder
	readonly ignoreCase: IRegexPartBuilder
	readonly lookahead: IRegexPartBuilder

	// TODO: *add* the return types...
	anyChar(): any
	word(): any
	digit(): any
	tab(): any	
	vTab(): any
	space(): any
	newline(): any
	literal(x: string): any
	unicodeChar(hex: string): any

	begin(): void
	// TODO: ADD THE TYPE for the `item` argument...
	addItem(item): void
	finalize(): IRegexMatcher<T>
}

export interface IRegexPartBuilder {
	begin(): void

	// TODO: add types for this! what is the `item`??? what is the return type of `finish()`???
	// * THESE SHOULD BE THE SAME, or related...
	addItem(item): void
	finish(): any
}
