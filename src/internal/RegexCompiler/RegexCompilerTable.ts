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
import { RawRegexBuilder } from "./RegexBuilder.js"
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
		const builder = RawRegexBuilder.instance
		this.compileDisjunction = compileComplexPart(() =>
			builder.disjunction()
		)
		this.compileDisjunct = compileComplexPart(() => builder.catenation())
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
		const builder = RawRegexBuilder.instance
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

	constructor() {
		const builder = RawRegexBuilder.instance
		this.compileAnyChar = compileAnyChar(builder)
		this.compileWord = compileWord(builder)
		this.compileDigit = compileDigit(builder)
		this.compileSpace = compileSpace(builder)
		this.compileCharClass = compileComplexPart(() => builder.charClass())
		this.compileClassRange = compileClassRange(builder)
		this.compileClassUnit = compileWrapper
		this.compileNegated = compileNegated(() => builder.negCharClass())
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

	constructor(toplevel: ToplevelCompilerTable) {
		const builder = RawRegexBuilder.instance
		this.compileIgnoreCase = compileRecursiveChoiceWrapper(
			() => builder.ignoreCase(),
			toplevel.compileDisjunction
		)
		this.compileLookahead = compileRecursiveChoiceWrapper(
			() => builder.lookahead(),
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
		const builder = RawRegexBuilder.instance
		this.compileTab = compileTab(builder)
		this.compileVTab = compileVTab(builder)
		this.compileFormFeed = compileFormFeed(builder)
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

	constructor() {
		const builder = RawRegexBuilder.instance
		this.compileTypeMatch = compileTypeMatch(builder)
	}
}

class ElementaryCompilerTable {
	private readonly compileLiteral: IRegexCompilerFunction

	get(): IRegexCompilerTypeTable {
		return [[SingleChar, this.compileLiteral]]
	}

	constructor() {
		const builder = RawRegexBuilder.instance
		this.compileLiteral = compileLiteral(builder)
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
