import type {
	ICellNode,
	INode,
	IRegexBuilder,
	IRegexMatcher,
	IRegexPartBuilder,
	ITableHandler,
	ITyped
} from "../../interfaces.js"
import { TableHandler } from "../../objects.js"
import { CurrentHash, TokenHash } from "../../objects/HashMap.js"
import { DepthStream } from "../../objects/Stream.js"
import { BasicMap } from "../../samples/TerminalMap.js"
import { next } from "../../utils/Stream.js"
import {
	AnyChar,
	Digit,
	Disjunct,
	Disjunction,
	EscapedLiteral,
	Group,
	IgnoreCaseGroup,
	LookaheadGroup,
	Newline,
	RootNode,
	SingleChar,
	Space,
	Tab,
	UnicodeChar,
	VTab,
	Word
} from "../RegexParser/Nodes.js"
import { RegexParser } from "../RegexParser/Parser.js"

// TODO : add the return type for `IRegexCompilerHandler` and `IRegexCompilerFunction`...
type IRegexCompilerHandler = ITableHandler<DepthStream<INode>>
type IRegexCompilerFunction = (
	input: DepthStream<INode>,
	handler: IRegexCompilerHandler
) => any

function compileWrapperPart(
	input: DepthStream<INode>,
	handler: IRegexCompilerHandler
) {
	next(input)
	return handler(input)
}

function compileComplexPart(builder: IRegexPartBuilder) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		builder.begin()
		for (const _ of input) builder.addItem(handler(input))
		return builder.finish()
	}
}

function compileGroup(
	input: DepthStream<INode>,
	handler: IRegexCompilerHandler
) {
	input.next() // Group
	input.next() // GroupBody
	return handler(input) // at RootNode
}

function compileRecursiveChoiceWrapper(
	builder: IRegexPartBuilder,
	handleDisjunction: IRegexCompilerFunction
) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // skip the wrapper (LookaheadGroup, IgnoreCaseGroup, etc)
		input.next() // skip the GroupBody
		input.next() // skip the RootRegex

		// expect the `Disjunction`
		builder.begin()
		builder.addItem(handleDisjunction(input, handler))
		return builder.finish()
	}
}

// TODO: PROVIDE THE TYPE FOR ELEMENTARIES HERE! [not `any`...]
function compileElementary(makeElementary: (builder: IRegexBuilder) => any) {
	return function (builder: IRegexBuilder) {
		return function (
			_input: DepthStream<INode>,
			_handler: IRegexCompilerHandler
		) {
			return makeElementary(builder)
		}
	}
}

const compileAnyChar = compileElementary((builder) => builder.anyChar())
const compileWord = compileElementary((builder) => builder.word())
const compileDigit = compileElementary((builder) => builder.digit())
const compileTab = compileElementary((builder) => builder.tab())
const compileVTab = compileElementary((builder) => builder.vTab())
const compileSpace = compileElementary((builder) => builder.space())
const compileNewline = compileElementary((builder) => builder.newline())

// TODO: ADD the type for nodes - not just `any` here...
function compileCell<T = any>(
	fromCell: (builder: IRegexBuilder, value: T) => any
) {
	return function (builder: IRegexBuilder) {
		return function (
			input: DepthStream<INode>,
			_handler: IRegexCompilerHandler
		) {
			return fromCell(builder, (input.curr as ICellNode<T>).value)
		}
	}
}

const compileUnicodeChar = compileCell<string>((builder, hex) =>
	builder.unicodeChar(hex)
)

const compileLiteral = compileCell<string>((builder, value) =>
	builder.literal(value)
)

// TODO: TO ADD:
// * 	1. Range ->
// 			1. TrivialRange
// 				1. RangeBoundary
// 			2. InfiniteRange
// 				1. RangeBoundary
// 			3. LimitsRange
// 				1. RangeBoundary
// 				2. RangeBoundary
// * 	2. "greedy" quantifiers
// * 	3. "non-greedy" quantifiers
// * 	4. Negated:
// 			1. This is STATICALLY EQUATED as in "Negated(X) -> Y"
// 			2. I.e. THERE ARE SEPARATE METHODS FOR THE "negated" VARIANTS!!!
// * 	5. TypeMatch:
// 			1. AsInt
// 			2. AsString
// * 	6. CharClass:
// 			1. ClassRange
// 			2. ClassUnit

class RegexCompilerTable {
	private compileDisjunction: IRegexCompilerFunction
	private compileDisjunct: IRegexCompilerFunction
	private compileIgnoreCase: IRegexCompilerFunction
	private compileLookahead: IRegexCompilerFunction
	private compileAnyChar: IRegexCompilerFunction
	private compileWord: IRegexCompilerFunction
	private compileDigit: IRegexCompilerFunction
	private compileTab: IRegexCompilerFunction
	private compileVTab: IRegexCompilerFunction
	private compileSpace: IRegexCompilerFunction
	private compileNewline: IRegexCompilerFunction
	private compileUnicodeChar: IRegexCompilerFunction
	private compileEscaped: IRegexCompilerFunction
	private compileLiteral: IRegexCompilerFunction

	init(builder: IRegexBuilder) {
		this.compileDisjunction = compileComplexPart(builder.disjunction)
		this.compileDisjunct = compileComplexPart(builder.catenation)
		this.compileIgnoreCase = compileRecursiveChoiceWrapper(
			builder.ignoreCase,
			this.compileDisjunction
		)
		this.compileLookahead = compileRecursiveChoiceWrapper(
			builder.lookahead,
			this.compileDisjunction
		)
		this.compileAnyChar = compileAnyChar(builder)
		this.compileWord = compileWord(builder)
		this.compileDigit = compileDigit(builder)
		this.compileTab = compileTab(builder)
		this.compileVTab = compileVTab(builder)
		this.compileSpace = compileSpace(builder)
		this.compileNewline = compileNewline(builder)
		this.compileUnicodeChar = compileUnicodeChar(builder)
		this.compileEscaped = compileLiteral(builder)
		this.compileLiteral = compileLiteral(builder)
	}

	get(): [ITyped, IRegexCompilerFunction][] {
		return [
			[RootNode, compileWrapperPart],
			[Disjunction, this.compileDisjunction],
			[Disjunct, this.compileDisjunct],
			[Group, compileGroup],
			[IgnoreCaseGroup, this.compileIgnoreCase],
			[LookaheadGroup, this.compileLookahead],
			[AnyChar, this.compileAnyChar],
			[Word, this.compileWord],
			[Digit, this.compileDigit],
			[Tab, this.compileTab],
			[VTab, this.compileVTab],
			[Space, this.compileSpace],
			[Newline, this.compileNewline],
			[UnicodeChar, this.compileUnicodeChar],
			[EscapedLiteral, this.compileEscaped],
			[SingleChar, this.compileLiteral]
		]
	}
}

function RegexNodeStream(source: string) {
	return new DepthStream(RegexParser.instance.parse(source))
}

export class RegexCompiler {
	static readonly instance = new RegexCompiler()

	private builder: IRegexBuilder
	private buildAlgorithm: ITableHandler
	private readonly compilerTable = new RegexCompilerTable()

	private build(regexAstStream: DepthStream) {
		this.builder.addItem(this.buildAlgorithm(regexAstStream))
	}

	private init(builder: IRegexBuilder) {
		this.builder = builder
		this.compilerTable.init(builder)
		this.constructAlgorithm()
	}

	private constructAlgorithm() {
		this.buildAlgorithm = TableHandler(
			new CurrentHash(
				new TokenHash(
					BasicMap(
						this.compilerTable
							.get()
							.map(([x, f]: [ITyped, Function]) => [x.type, f])
					)
				)
			)
		)
	}

	compile(source: string, builder: IRegexBuilder): IRegexMatcher {
		this.init(builder)
		this.builder.begin()
		this.build(RegexNodeStream(source))
		return this.builder.finalize()
	}

	private constructor() {}
}
