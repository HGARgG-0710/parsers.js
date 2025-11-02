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
	FormFeed,
	Greedy,
	Group,
	IgnoreCaseGroup,
	Negated,
	Newline,
	NoCaptureGroup,
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
	compileFormFeed,
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
import { RawRegexFactory } from "./RegexFactory.js"
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

	constructor() {
		const factory = RawRegexFactory.instance
		this.compileDisjunction = compileComplexPart(() =>
			factory.disjunction()
		)
		this.compileDisjunct = compileComplexPart(() => factory.catenation())
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

	constructor() {
		const factory = RawRegexFactory.instance
		this.compileGreedy = compileGreedy(factory)
		this.compileNonGreedy = compileNonGreedy(factory)
		this.compileOptional = compileOptional(factory)
		this.compileNoneOrMore = compileNoneOrMore(factory)
		this.compileOneOrMore = compileOneOrMore(factory)
		this.compileRange = compileRange(factory)
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

	constructor() {
		const factory = RawRegexFactory.instance
		this.compileAnyChar = compileAnyChar(factory)
		this.compileWord = compileWord(factory)
		this.compileDigit = compileDigit(factory)
		this.compileSpace = compileSpace(factory)
		this.compileCharClass = compileComplexPart(() => factory.charClass())
		this.compileClassUnit = compileWrapper
		this.compileClassRange = compileClassRange(factory)
		this.compileNegated = compileNegated(() => factory.negCharClass())
	}
}

class GroupCompilerTable {
	private readonly compileIgnoreCase: IRegexCompilerFunction
	private readonly compileNoCapture: IRegexCompilerFunction

	get(): IRegexCompilerTypeTable {
		return [
			[Group, compileGroup],
			[IgnoreCaseGroup, this.compileIgnoreCase],
			[NoCaptureGroup, this.compileNoCapture]
		]
	}

	constructor(toplevel: ToplevelCompilerTable) {
		const factory = RawRegexFactory.instance
		this.compileIgnoreCase = compileRecursiveChoiceWrapper(
			() => factory.ignoreCase(),
			toplevel.compileDisjunction
		)
		this.compileNoCapture = compileRecursiveChoiceWrapper(
			() => factory.noCapture(),
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
	private readonly compileFormFeed: IRegexCompilerFunction

	get(): IRegexCompilerTypeTable {
		return [
			[Tab, this.compileTab],
			[VTab, this.compileVTab],
			[FormFeed, this.compileFormFeed],
			[Newline, this.compileNewline],
			[UnicodeChar, this.compileUnicodeChar],
			[EscapedLiteral, this.compileEscaped]
		]
	}

	constructor() {
		const factory = RawRegexFactory.instance
		this.compileTab = compileTab(factory)
		this.compileVTab = compileVTab(factory)
		this.compileFormFeed = compileFormFeed(factory)
		this.compileNewline = compileNewline(factory)
		this.compileUnicodeChar = compileUnicodeChar(factory)
		this.compileEscaped = compileLiteral(factory)
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

	constructor() {
		const factory = RawRegexFactory.instance
		this.compileTypeMatch = compileTypeMatch(factory)
	}
}

class ElementaryCompilerTable {
	private readonly compileLiteral: IRegexCompilerFunction

	get(): IRegexCompilerTypeTable {
		return [[SingleChar, this.compileLiteral]]
	}

	constructor() {
		const factory = RawRegexFactory.instance
		this.compileLiteral = compileLiteral(factory)
	}
}

export class RegexCompilerTable {
	static readonly instance = new RegexCompilerTable()

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

	private constructor() {
		this.quantifiers = new QuantifierCompilerTable()
		this.charClasses = new CharClassCompilerTable()
		this.toplevel = new ToplevelCompilerTable()
		this.groups = new GroupCompilerTable(this.toplevel)
		this.special = new SpecialCharacterTable()
		this.typeMatch = new TypeMatchCompilerTable()
		this.elementary = new ElementaryCompilerTable()
	}
}
