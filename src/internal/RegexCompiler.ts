import type {
	ICellNode,
	INode,
	IRegexBuilder,
	IRegexMatcher,
	IRegexPartBuilder,
	ITableHandler,
	ITyped,
	IValidNodeType
} from "../interfaces.js"
import { TableHandler } from "../objects.js"
import { ConstructorError } from "../objects/Error.js"
import { CurrentHash, TokenHash } from "../objects/HashMap.js"
import { DepthStream } from "../objects/Stream.js"
import { BasicMap } from "../samples/TerminalMap.js"
import { mapTypes } from "../utils/Node.js"
import { next } from "../utils/Stream.js"
import { AutoMap } from "./AutoMap.js"
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
	Greedy,
	Group,
	IgnoreCaseGroup,
	InfiniteRange,
	LimitsRange,
	LookaheadGroup,
	Negated,
	Newline,
	NoneOrMore,
	NonGreedy,
	OneOrMore,
	Optional,
	RangeQuantifier,
	RootNode,
	SingleChar,
	Space,
	Tab,
	TrivialRange,
	TypeMatch,
	UnicodeChar,
	VTab,
	Word
} from "./RegexParser/Nodes.js"
import { RegexParser } from "./RegexParser/Parser.js"

// TODO : add the return type for `IRegexCompilerHandler` and `IRegexCompilerFunction`...
type IRegexCompilerHandler = ITableHandler<DepthStream<INode>>

type IRegexCompilerFunction = (
	input: DepthStream<INode>,
	handler: IRegexCompilerHandler
) => any

type IRegexCompilerErrorHandler = (
	input: DepthStream<INode>,
	_handler: IRegexCompilerHandler
) => void

type IRegexCompilerTypeTable = [ITyped, IRegexCompilerFunction][]

function RegexTypeHandler(
	map: [IValidNodeType, IRegexCompilerFunction][],
	errHandler: IRegexCompilerErrorHandler
) {
	return TableHandler(
		new CurrentHash(new TokenHash(BasicMap(map, errHandler)))
	)
}

class RegexCompilationError extends ConstructorError {
	constructor(item: INode) {
		super(
			`Error compiling the item: ${item.debugPrint()} to a Regex object`
		)
	}
}

function compilerBuilderErrHandler(
	input: DepthStream<INode>,
	_handler: IRegexCompilerHandler
) {
	throw new RegexCompilationError(input.curr)
}

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

function compileNegated(negCharClassBuilder: IRegexPartBuilder) {
	const negCharClassCompiler = compileComplexPart(negCharClassBuilder)
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // Negated
		return negCharClassCompiler(input, handler)
	}
}

function compileOptional(builder: IRegexBuilder) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // Optional
		return builder.optional(handler(input))
	}
}

function compileNoneOrMore(builder: IRegexBuilder) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // NoneOrMore
		return builder.noneOrMore(handler(input))
	}
}

function compileOneOrMore(builder: IRegexBuilder) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // OneOrMore
		builder.catenation.begin()
		builder.catenation.addItem(handler(input))
		input.next()
		builder.catenation.addItem(builder.noneOrMore(handler(input)))
		return builder.catenation.finish()
	}
}

function readRangeBoundary(range: INode, isStart: boolean) {
	return (range.read(1 - +isStart) as ICellNode<number>).value
}

function readStartBoundary(range: INode) {
	return readRangeBoundary(range, true)
}

function readEndBoundary(range: INode) {
	return readRangeBoundary(range, false)
}

function handleTrivialRange(input: DepthStream<INode>) {
	const times = readStartBoundary(input.curr)
	return [times, times]
}

function handleInfiniteRange(input: DepthStream<INode>) {
	const from = readStartBoundary(input.curr)
	return [from, Infinity]
}

function handleLimitsRange(input: DepthStream<INode>) {
	const range = input.curr
	return [readStartBoundary(range), readEndBoundary(range)]
}

// ! Replace the `compilerBuilderErrHandler` with a more appropriate one...
const rangeKindsHandler = RegexTypeHandler(
	mapTypes([
		[TrivialRange, handleTrivialRange],
		[InfiniteRange, handleInfiniteRange],
		[LimitsRange, handleLimitsRange]
	]),
	compilerBuilderErrHandler
)

// TODO: REFACTOR THIS [the function is way too large...]
function compileRange(builder: IRegexBuilder) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // RangeQuantifier
		const toMatch = handler(input)
		input.next()
		input.next() // Range

		const [from, to] = rangeKindsHandler(input)
		const more = to - from

		builder.catenation.begin()
		builder.catenation.addItem(builder.repeat(toMatch, from))

		if (more > 0)
			if (more === Infinity)
				builder.catenation.addItem(builder.noneOrMore(toMatch))
			else
				for (let i = 0; i < more; ++i)
					builder.catenation.addItem(builder.optional(toMatch))

		return builder.catenation.finish()
	}
}

function compileGreedy(builder: IRegexBuilder) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // Greedy
		return builder.greedy(handler(input))
	}
}

function compileNonGreedy(builder: IRegexBuilder) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // NonGreedy
		return builder.nonGreedy(handler(input))
	}
}

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
	private readonly compileNegated: IRegexCompilerFunction
	private readonly compileGreedy: IRegexCompilerFunction
	private readonly compileNonGreedy: IRegexCompilerFunction
	private readonly compileOptional: IRegexCompilerFunction
	private readonly compileNoneOrMore: IRegexCompilerFunction
	private readonly compileOneOrMore: IRegexCompilerFunction
	private readonly compileRange: IRegexCompilerFunction

	private getToplevel(): IRegexCompilerTypeTable {
		return [
			[RootNode, compileWrapper],
			[Disjunction, this.compileDisjunction],
			[Disjunct, this.compileDisjunct]
		]
	}

	private getGroups(): IRegexCompilerTypeTable {
		return [
			[Group, compileGroup],
			[IgnoreCaseGroup, this.compileIgnoreCase],
			[LookaheadGroup, this.compileLookahead]
		]
	}

	private getCharClasses(): IRegexCompilerTypeTable {
		return [
			[AnyChar, this.compileAnyChar],
			[Word, this.compileWord],
			[Digit, this.compileDigit],
			[VTab, this.compileVTab],
			[Space, this.compileSpace],
			[CharClass, this.compileCharClass],
			[ClassRange, this.compileClassRange],
			[ClassUnit, this.compileClassUnit],
			[Negated, this.compileNegated]
		]
	}

	private getSpecialCharacters(): IRegexCompilerTypeTable {
		return [
			[Tab, this.compileTab],
			[Newline, this.compileNewline],
			[UnicodeChar, this.compileUnicodeChar],
			[EscapedLiteral, this.compileEscaped]
		]
	}

	private getTypeMatch(): IRegexCompilerTypeTable {
		return [
			[TypeMatch, this.compileTypeMatch],
			[AsString, compileAsString],
			[AsInt, compileAsInt]
		]
	}

	private getQuantifiers(): IRegexCompilerTypeTable {
		return [
			[Greedy, this.compileGreedy],
			[NonGreedy, this.compileNonGreedy],
			[Optional, this.compileOptional],
			[NoneOrMore, this.compileNoneOrMore],
			[OneOrMore, this.compileOneOrMore],
			[RangeQuantifier, this.compileRange]
		]
	}

	private getElementary(): IRegexCompilerTypeTable {
		return [[SingleChar, this.compileLiteral]]
	}

	get(): IRegexCompilerTypeTable {
		return [
			...this.getToplevel(),
			...this.getGroups(),
			...this.getCharClasses(),
			...this.getSpecialCharacters(),
			...this.getTypeMatch(),
			...this.getQuantifiers(),
			...this.getElementary()
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
		this.compileNegated = compileNegated(builder.negCharClass)
		this.compileGreedy = compileGreedy(builder)
		this.compileNonGreedy = compileNonGreedy(builder)
		this.compileOptional = compileOptional(builder)
		this.compileNoneOrMore = compileNoneOrMore(builder)
		this.compileOneOrMore = compileOneOrMore(builder)
		this.compileRange = compileRange(builder)
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
		this.buildAlgorithm = RegexTypeHandler(
			mapTypes(RegexCompilerTableStorage.instance.get(builder)),
			compilerBuilderErrHandler
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
