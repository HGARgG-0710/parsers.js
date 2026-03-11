import type { Parametrized, Regex } from "../objects.js"
import type { TreeStream } from "../objects/Stream.js"
import type { INode, ITyped, IValidNodeType } from "./Node.js"
import type { IPeekableStream, IStreamChooser } from "./Stream.js"
import type { ITableHandler } from "./StreamHandler.js"

export type IPartialMatch<T = any> = T | string

export type IMatchResult<T = any> = IPartialMatch<T>[]

export type IMatch<T = any> = false | IMatchResult<T>

export interface IRegexMatcher {
	match<T = any>(stream: IPeekableStream<T>): IMatch
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
	handleUnicodePropertyAlias(unicodeProp: Regex.Raw.UnicodeProperty.Alias): T
	handleUnicodeProperty(unicodeProp: Regex.Raw.UnicodeProperty): T
	handleEither(either: Regex.Raw.Either): T
	handleCatenationLike(items: Regex.Raw[]): T
	handleOptional(optional: Regex.Raw.Optional): T
	handleNoneOrMore(noneOrMore: Regex.Raw.NoneOrMore): T
	handleChar(char: Regex.Raw.Char): T
	handleTokenType(tokenType: Regex.Raw.TokenType): T
	handleCodeRange(codeRange: Regex.Raw.CodeRange): T
	handleAnything(anything: Regex.Raw.Anything): T
	handleNoneOf(noneOf: Regex.Raw.NoneOf): T
	handleNonBoundary(nonBoundary: Regex.Raw.NonBoundary): T
	handleBoundary(boundary: Regex.Raw.Boundary): T
}

export type IRegexParserBindableTableRow = (
	recursive: Parametrized<Regex.Extension[], IStreamChooser>
) => [string, IStreamChooser]

export type IRegexCompilerTypeTableBindableRow<Out = Regex.Raw> = (
	factory: IRegexFactory
) => IRegexCompilerTypeTableRow<Out>

export type IRegexCompilerTypeTableRow<Out = Regex.Raw> = [
	ITyped,
	IRegexCompilerFunction<Out>
]

export type IRegexCompilerTypeTable<Out = Regex.Raw> =
	IRegexCompilerTypeTableRow<Out>[]

export type IRegexCompilerFunction<Out = Regex.Raw> = (
	input: TreeStream<INode>,
	handler: IRegexCompilerHandler<any>
) => Out

export type IRegexCompilerHandler<Out = Regex.Raw> = ITableHandler<
	TreeStream<INode>,
	Out
>

export interface IRegexFactory {
	disjunction(): IRegexPartBuilder
	catenation(): IRegexPartBuilder
	ignoreCase(): IRegexPartBuilder
	noCapture(): IRegexPartBuilder
	charClass(): IRegexPartBuilder
	boundaryClass(): IRegexPartBuilder
	negCharClass(): IRegexPartBuilder
	negBoundaryClass(): IRegexPartBuilder

	anything(): Regex.Raw
	word(): Regex.Raw
	digit(): Regex.Raw
	space(): Regex.Raw
	newline(): Regex.Raw
	literal(x: string): Regex.Raw.Char
	charRange(from: string, to: string): Regex.Raw
	unicodeChar(hex: string): Regex.Raw.Char
	typeMatch(type: IValidNodeType): Regex.Raw
	noneOrMore(item: Regex.Raw): Regex.Raw
	optional(item: Regex.Raw): Regex.Raw
	repeat(item: Regex.Raw, times: number): Regex.Raw
	unicodeProperty(propName: string, value: string): Regex.Raw
	unicodePropertyAlias(propName: string): Regex.Raw
}

export interface IMatchedState<T = any> {
	readonly captured: IPartialMatch<T>
}

export type ICaptureResolutionPredicate<T = any> = (
	matchedStates: IMatchedState<T>[]
) => number
