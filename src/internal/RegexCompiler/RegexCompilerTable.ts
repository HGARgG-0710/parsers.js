import type { IRegexBuilder } from "../../interfaces.js"
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
	Greedy,
	Group,
	IgnoreCaseGroup,
	LookaheadGroup,
	Negated,
	Newline,
	NonGreedy,
	NoneOrMore,
	OneOrMore,
	Optional,
	RangeQuantifier,
	RootNode,
	SingleChar,
	Space,
	Tab,
	TypeMatch,
	UnicodeChar,
	VTab,
	Word
} from "../RegexParser/Nodes.js"
import { compileLiteral, compileUnicodeChar } from "./Cell.js"
import { compileClassRange, compileNegated } from "./CharClass.js"
import {
	type IRegexCompilerFunction,
	type IRegexCompilerTypeTable
} from "./Compiler.js"
import { compileComplexPart } from "./Complex.js"
import {
	compileAnyChar,
	compileDigit,
	compileNewline,
	compileSpace,
	compileTab,
	compileVTab,
	compileWord
} from "./Elementary.js"
import { compileGroup, compileRecursiveChoiceWrapper } from "./Group.js"
import { compileGreedy, compileNonGreedy } from "./Quantifiers/Greedy.js"
import { compileNoneOrMore } from "./Quantifiers/NoneOrMore.js"
import { compileOneOrMore } from "./Quantifiers/OneOrMore.js"
import { compileOptional } from "./Quantifiers/Optional.js"
import { compileRange } from "./Quantifiers/Range.js"
import { compileAsInt, compileAsString, compileTypeMatch } from "./TypeMatch.js"
import { compileWrapper } from "./Wrapper.js"

class ToplevelCompilerTable {
	readonly compileDisjunction: IRegexCompilerFunction
	private readonly compileDisjunct: IRegexCompilerFunction

	get(): IRegexCompilerTypeTable {
		return [
			[RootNode, compileWrapper],
			[Disjunction, this.compileDisjunction],
			[Disjunct, this.compileDisjunct]
		]
	}

	constructor(builder: IRegexBuilder) {
		this.compileDisjunction = compileComplexPart(builder.disjunction)
		this.compileDisjunct = compileComplexPart(builder.catenation)
	}
}

class QuantifierCompilerTable {
	private readonly compileGreedy: IRegexCompilerFunction
	private readonly compileNonGreedy: IRegexCompilerFunction
	private readonly compileOptional: IRegexCompilerFunction
	private readonly compileNoneOrMore: IRegexCompilerFunction
	private readonly compileOneOrMore: IRegexCompilerFunction
	private readonly compileRange: IRegexCompilerFunction

	get(): IRegexCompilerTypeTable {
		return [
			[Greedy, this.compileGreedy],
			[NonGreedy, this.compileNonGreedy],
			[Optional, this.compileOptional],
			[NoneOrMore, this.compileNoneOrMore],
			[OneOrMore, this.compileOneOrMore],
			[RangeQuantifier, this.compileRange]
		]
	}

	constructor(builder: IRegexBuilder) {
		this.compileGreedy = compileGreedy(builder)
		this.compileNonGreedy = compileNonGreedy(builder)
		this.compileOptional = compileOptional(builder)
		this.compileNoneOrMore = compileNoneOrMore(builder)
		this.compileOneOrMore = compileOneOrMore(builder)
		this.compileRange = compileRange(builder)
	}
}

class CharClassCompilerTable {
	private readonly compileAnyChar: IRegexCompilerFunction
	private readonly compileWord: IRegexCompilerFunction
	private readonly compileDigit: IRegexCompilerFunction
	private readonly compileSpace: IRegexCompilerFunction
	private readonly compileCharClass: IRegexCompilerFunction
	private readonly compileClassRange: IRegexCompilerFunction
	private readonly compileClassUnit: IRegexCompilerFunction
	private readonly compileNegated: IRegexCompilerFunction

	get(): IRegexCompilerTypeTable {
		return [
			[AnyChar, this.compileAnyChar],
			[Word, this.compileWord],
			[Digit, this.compileDigit],
			[Space, this.compileSpace],
			[CharClass, this.compileCharClass],
			[ClassRange, this.compileClassRange],
			[ClassUnit, this.compileClassUnit],
			[Negated, this.compileNegated]
		]
	}

	constructor(builder: IRegexBuilder) {
		this.compileAnyChar = compileAnyChar(builder)
		this.compileWord = compileWord(builder)
		this.compileDigit = compileDigit(builder)
		this.compileSpace = compileSpace(builder)
		this.compileCharClass = compileComplexPart(builder.charClass)
		this.compileClassRange = compileClassRange(builder)
		this.compileClassUnit = compileWrapper
		this.compileNegated = compileNegated(builder.negCharClass)
	}
}

class GroupCompilerTable {
	private readonly compileIgnoreCase: IRegexCompilerFunction
	private readonly compileLookahead: IRegexCompilerFunction

	get(): IRegexCompilerTypeTable {
		return [
			[Group, compileGroup],
			[IgnoreCaseGroup, this.compileIgnoreCase],
			[LookaheadGroup, this.compileLookahead]
		]
	}

	constructor(builder: IRegexBuilder, toplevel: ToplevelCompilerTable) {
		this.compileIgnoreCase = compileRecursiveChoiceWrapper(
			builder.ignoreCase,
			toplevel.compileDisjunction
		)
		this.compileLookahead = compileRecursiveChoiceWrapper(
			builder.lookahead,
			toplevel.compileDisjunction
		)
	}
}

class SpecialCharacterTable {
	private readonly compileTab: IRegexCompilerFunction
	private readonly compileVTab: IRegexCompilerFunction
	private readonly compileNewline: IRegexCompilerFunction
	private readonly compileUnicodeChar: IRegexCompilerFunction
	private readonly compileEscaped: IRegexCompilerFunction

	get(): IRegexCompilerTypeTable {
		return [
			[Tab, this.compileTab],
			[VTab, this.compileVTab],
			[Newline, this.compileNewline],
			[UnicodeChar, this.compileUnicodeChar],
			[EscapedLiteral, this.compileEscaped]
		]
	}

	constructor(builder: IRegexBuilder) {
		this.compileTab = compileTab(builder)
		this.compileVTab = compileVTab(builder)
		this.compileNewline = compileNewline(builder)
		this.compileUnicodeChar = compileUnicodeChar(builder)
		this.compileEscaped = compileLiteral(builder)
	}
}

class TypeMatchCompilerTable {
	private readonly compileTypeMatch: IRegexCompilerFunction

	get(): IRegexCompilerTypeTable {
		return [
			[TypeMatch, this.compileTypeMatch],
			[AsString, compileAsString],
			[AsInt, compileAsInt]
		]
	}

	constructor(builder: IRegexBuilder) {
		this.compileTypeMatch = compileTypeMatch(builder)
	}
}

class ElementaryCompilerTable {
	private readonly compileLiteral: IRegexCompilerFunction

	get(): IRegexCompilerTypeTable {
		return [[SingleChar, this.compileLiteral]]
	}

	constructor(builder: IRegexBuilder) {
		this.compileLiteral = compileLiteral(builder)
	}
}

class RegexCompilerTable {
	private readonly charClasses: CharClassCompilerTable
	private readonly quantifiers: QuantifierCompilerTable
	private readonly toplevel: ToplevelCompilerTable
	private readonly groups: GroupCompilerTable
	private readonly special: SpecialCharacterTable
	private readonly typeMatch: TypeMatchCompilerTable
	private readonly elementary: ElementaryCompilerTable

	get(): IRegexCompilerTypeTable {
		return [
			...this.toplevel.get(),
			...this.groups.get(),
			...this.charClasses.get(),
			...this.special.get(),
			...this.typeMatch.get(),
			...this.quantifiers.get(),
			...this.elementary.get()
		]
	}

	constructor(builder: IRegexBuilder) {
		this.quantifiers = new QuantifierCompilerTable(builder)
		this.charClasses = new CharClassCompilerTable(builder)
		this.toplevel = new ToplevelCompilerTable(builder)
		this.groups = new GroupCompilerTable(builder, this.toplevel)
		this.special = new SpecialCharacterTable(builder)
		this.typeMatch = new TypeMatchCompilerTable(builder)
		this.elementary = new ElementaryCompilerTable(builder)
	}
}

export class RegexCompilerTableStorage {
	static readonly instance = new RegexCompilerTableStorage()

	private readonly stored = new AutoMap<IRegexBuilder, RegexCompilerTable>(
		(regexBuilder) => new RegexCompilerTable(regexBuilder)
	)

	get(builder: IRegexBuilder) {
		return this.stored.get(builder).get()
	}

	private constructor() {}
}
