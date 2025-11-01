import type { IValidNodeType } from "./Node.js"
import type { IPeekableStream } from "./Stream.js"

export interface IRegexMatcher<T = any> {
	match(stream: IPeekableStream<T>): false | string
}

interface IPrePartBuilder {
	// TODO: ADD THE TYPE for the `item` argument...
	addItem(item): void
}

export interface IRegexBuilder<T = any> extends IPrePartBuilder {
	begin(): void

	disjunction: () => IRegexPartBuilder
	catenation: () => IRegexPartBuilder
	ignoreCase: () => IRegexPartBuilder
	lookahead: () => IRegexPartBuilder
	charClass: () => IRegexPartBuilder
	negCharClass: () => IRegexPartBuilder

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
	greedy(item: any): any
	nonGreedy(item: any): any
	noneOrMore(item: any): any
	optional(item: any): any
	repeat(item: any, times: number): any

	finalize(): IRegexMatcher<T>
}

export interface IRegexPartBuilder extends IPrePartBuilder {
	// TODO: add types for this! what is the `item`??? what is the return type of `finish()`???
	// * THIS SHOULD BE THE SAME as `addItem`, or related...
	finish(): any
}
