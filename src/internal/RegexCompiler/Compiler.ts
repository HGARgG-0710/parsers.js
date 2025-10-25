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
import { AutoMap } from "../AutoMap.js"
import {
	AnyChar,
	AsInt,
	AsString,
	CharClass,
	ClassRange,
	ClassUnit,
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
	TypeMatch,
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

function compileWrapper(
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
		const root = input.curr
		for (let i = 0; i < root.lastChild; ++i) {
			input.next()
			builder.addItem(handler(input))
		}
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
const compileTab = compileElementary((builder) => builder.literal("\t"))
const compileVTab = compileElementary((builder) => builder.literal("\v"))
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

function compileAsInt(
	input: DepthStream<INode>,
	_handler: IRegexCompilerHandler
) {
	return Number((input.curr as ICellNode<string>).value)
}

function compileAsString(
	input: DepthStream<INode>,
	_handler: IRegexCompilerHandler
) {
	return (input.curr as ICellNode<string>).value
}

function compileTypeMatch(builder: IRegexBuilder) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // TypeMatch
		return builder.typeMatch(handler(input))
	}
}

function compileClassRange(builder: IRegexBuilder) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // ClassRange
		const from = handler(input)
		input.next() // ClassUnit
		const to = handler(input)
		return builder.charRange(from, to)
	}
}

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
// TODO: order the `RegexCompilerTable.get()` method table FOR PERFORMANCE (some entities will be MORE LIKELY to appear than others)

class RegexCompilerTable {
	private readonly compileDisjunction: IRegexCompilerFunction
	private readonly compileDisjunct: IRegexCompilerFunction
	private readonly compileIgnoreCase: IRegexCompilerFunction
	private readonly compileLookahead: IRegexCompilerFunction
	private readonly compileAnyChar: IRegexCompilerFunction
	private readonly compileWord: IRegexCompilerFunction
	private readonly compileDigit: IRegexCompilerFunction
	private readonly compileTab: IRegexCompilerFunction
	private readonly compileVTab: IRegexCompilerFunction
	private readonly compileSpace: IRegexCompilerFunction
	private readonly compileNewline: IRegexCompilerFunction
	private readonly compileUnicodeChar: IRegexCompilerFunction
	private readonly compileEscaped: IRegexCompilerFunction
	private readonly compileLiteral: IRegexCompilerFunction
	private readonly compileTypeMatch: IRegexCompilerFunction
	private readonly compileCharClass: IRegexCompilerFunction
	private readonly compileClassRange: IRegexCompilerFunction
	private readonly compileClassUnit: IRegexCompilerFunction

	get(): [ITyped, IRegexCompilerFunction][] {
		return [
			[RootNode, compileWrapper],
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
			[TypeMatch, this.compileTypeMatch],
			[AsString, compileAsString],
			[AsInt, compileAsInt],
			[CharClass, this.compileCharClass],
			[ClassRange, this.compileClassRange],
			[ClassUnit, this.compileClassUnit],
			[SingleChar, this.compileLiteral]
		]
	}

	constructor(builder: IRegexBuilder) {
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
		this.compileTypeMatch = compileTypeMatch(builder)
		this.compileCharClass = compileComplexPart(builder.charClass)
		this.compileClassRange = compileClassRange(builder)
		this.compileClassUnit = compileWrapper
	}
}

class RegexCompilerTableStorage {
	static readonly instance = new RegexCompilerTableStorage()

	private readonly stored = new AutoMap<IRegexBuilder, RegexCompilerTable>(
		(regexBuilder) => new RegexCompilerTable(regexBuilder)
	)

	get(builder: IRegexBuilder) {
		return this.stored.get(builder).get()
	}

	private constructor() {}
}

function RegexNodeStream(source: string) {
	return new DepthStream(RegexParser.instance.parse(source))
}

class RegexCompilerAlgorithmBuilder {
	static readonly instance = new RegexCompilerAlgorithmBuilder()

	private buildAlgorithm: ITableHandler

	init(builder: IRegexBuilder) {
		this.buildAlgorithm = TableHandler(
			new CurrentHash(
				new TokenHash(
					BasicMap(
						RegexCompilerTableStorage.instance
							.get(builder)
							.map(([x, f]: [ITyped, Function]) => [x.type, f])
					)
				)
			)
		)
	}

	algorithm(input: DepthStream<INode>) {
		return this.buildAlgorithm(input)
	}

	private constructor() {}
}

export class RegexCompiler {
	static readonly instance = new RegexCompiler()

	private builder: IRegexBuilder

	private build(regexAstStream: DepthStream<INode>) {
		this.builder.addItem(
			RegexCompilerAlgorithmBuilder.instance.algorithm(regexAstStream)
		)
	}

	private init(builder: IRegexBuilder) {
		this.builder = builder
		RegexCompilerAlgorithmBuilder.instance.init(builder)
		this.constructAlgorithm()
	}

	private constructAlgorithm() {}

	compile(source: string, builder: IRegexBuilder): IRegexMatcher {
		this.init(builder)
		this.builder.begin()
		this.build(RegexNodeStream(source))
		return this.builder.finalize()
	}

	private constructor() {}
}
