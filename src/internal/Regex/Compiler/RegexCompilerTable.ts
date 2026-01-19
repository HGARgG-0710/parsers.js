import type {
	IRegexCompilerFunction,
	IRegexCompilerTypeTable
} from "src/interfaces/Regex.js"
import type { IRegexFactory } from "../../../interfaces.js"
import { AutoMap, Regex } from "../../../objects.js"
import {
	AnyChar,
	AsInt,
	AsString,
	BoundaryClass,
	CharClass,
	ClassRange,
	ClassUnit,
	Digit,
	Disjunct,
	Disjunction,
	EscapedLiteral,
	FormFeed,
	Group,
	IgnoreCaseGroup,
	Negated,
	Newline,
	NoCaptureGroup,
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
	UnicodeProperty,
	VTab,
	Word
} from "../Parser/Nodes.js"
import { compileLiteral, compileUnicodeChar } from "./Cell.js"
import {
	compileBoundaryClass,
	compileCharClass,
	compileClassRange,
	compileNegated
} from "./Class.js"
import { compileComplexPart } from "./Complex.js"
import {
	compileAnyChar,
	compileDigit,
	compileFormFeed,
	compileNewline,
	compileSpace,
	compileTab,
	compileUnicodeProperty,
	compileVTab,
	compileWord
} from "./Elementary.js"
import { compileGroup, compileRecursiveChoiceWrapper } from "./Group.js"
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

	constructor(factory: IRegexFactory) {
		this.compileDisjunction = compileComplexPart(() =>
			factory.disjunction()
		)
		this.compileDisjunct = compileComplexPart(() => factory.catenation())
	}
}

class QuantifierCompilerTable {
	private readonly compileOptional: IRegexCompilerFunction
	private readonly compileNoneOrMore: IRegexCompilerFunction
	private readonly compileOneOrMore: IRegexCompilerFunction
	private readonly compileRange: IRegexCompilerFunction

	get(): IRegexCompilerTypeTable {
		return [
			[Optional, this.compileOptional],
			[NoneOrMore, this.compileNoneOrMore],
			[OneOrMore, this.compileOneOrMore],
			[RangeQuantifier, this.compileRange]
		]
	}

	constructor(factory: IRegexFactory) {
		this.compileOptional = compileOptional(factory)
		this.compileNoneOrMore = compileNoneOrMore(factory)
		this.compileOneOrMore = compileOneOrMore(factory)
		this.compileRange = compileRange(factory)
	}
}

class ClassCompilerTable {
	private readonly compileAnyChar: IRegexCompilerFunction
	private readonly compileWord: IRegexCompilerFunction
	private readonly compileDigit: IRegexCompilerFunction
	private readonly compileSpace: IRegexCompilerFunction
	private readonly compileCharClass: IRegexCompilerFunction
	private readonly compileBoundaryClass: IRegexCompilerFunction
	private readonly compileClassRange: IRegexCompilerFunction
	private readonly compileClassUnit: IRegexCompilerFunction
	private readonly compileNegated: IRegexCompilerFunction
	private readonly compileUnicodeProperty: IRegexCompilerFunction

	get(): IRegexCompilerTypeTable {
		return [
			[AnyChar, this.compileAnyChar],
			[Word, this.compileWord],
			[Digit, this.compileDigit],
			[Space, this.compileSpace],
			[CharClass, this.compileCharClass],
			[BoundaryClass, this.compileBoundaryClass],
			[ClassRange, this.compileClassRange],
			[ClassUnit, this.compileClassUnit],
			[Negated, this.compileNegated],
			[UnicodeProperty, this.compileUnicodeProperty]
		]
	}

	constructor(factory: IRegexFactory) {
		this.compileAnyChar = compileAnyChar(factory)
		this.compileWord = compileWord(factory)
		this.compileDigit = compileDigit(factory)
		this.compileSpace = compileSpace(factory)
		this.compileCharClass = compileCharClass(factory)
		this.compileBoundaryClass = compileBoundaryClass(factory)
		this.compileClassUnit = compileWrapper
		this.compileClassRange = compileClassRange(factory)
		this.compileNegated = compileNegated(factory)
		this.compileUnicodeProperty = compileUnicodeProperty(factory)
	}
}

class GroupCompilerTable {
	private readonly compileIgnoreCase: IRegexCompilerFunction
	private readonly compileNoCapture: IRegexCompilerFunction

	private getCustomExtensionsRows(extensions: Regex.Extension[]) {
		return extensions
			.filter((ext) => ext.getCompilerTableRow)
			.map((ext) => ext.getCompilerTableRow!(this.factory))
	}

	private getExtensions(
		extensions: Regex.Extension[]
	): IRegexCompilerTypeTable {
		return [
			...this.getCustomExtensionsRows(extensions),
			[IgnoreCaseGroup, this.compileIgnoreCase]
		]
	}

	get(extensions: Regex.Extension[]): IRegexCompilerTypeTable {
		return [
			[Group, compileGroup],
			[NoCaptureGroup, this.compileNoCapture],
			...this.getExtensions(extensions)
		]
	}

	constructor(
		private readonly factory: IRegexFactory,
		toplevel: ToplevelCompilerTable
	) {
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

	constructor(factory: IRegexFactory) {
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

	get(): IRegexCompilerTypeTable<Regex.Raw | string | number> {
		return [
			[TypeMatch, this.compileTypeMatch],
			[AsString, compileAsString],
			[AsInt, compileAsInt]
		]
	}

	constructor(factory: IRegexFactory) {
		this.compileTypeMatch = compileTypeMatch(factory)
	}
}

class ElementaryCompilerTable {
	private readonly compileLiteral: IRegexCompilerFunction

	get(): IRegexCompilerTypeTable {
		return [[SingleChar, this.compileLiteral]]
	}

	constructor(factory: IRegexFactory) {
		this.compileLiteral = compileLiteral(factory)
	}
}

class RegexCompilerTableMap {
	private readonly compilerTables = new AutoMap<
		IRegexFactory,
		RegexCompilerTable
	>((factory) => new RegexCompilerTable(factory))

	get(factory: IRegexFactory) {
		return this.compilerTables.get(factory)
	}
}

export class RegexCompilerTable {
	private static readonly tables = new RegexCompilerTableMap()

	static with(factory: IRegexFactory) {
		return this.tables.get(factory)
	}

	private readonly charClasses: ClassCompilerTable
	private readonly quantifiers: QuantifierCompilerTable
	private readonly toplevel: ToplevelCompilerTable
	private readonly groups: GroupCompilerTable
	private readonly special: SpecialCharacterTable
	private readonly typeMatch: TypeMatchCompilerTable
	private readonly elementary: ElementaryCompilerTable

	get(
		extensions: Regex.Extension[]
	): IRegexCompilerTypeTable<Regex.Raw | string | number> {
		return [
			...this.toplevel.get(),
			...this.groups.get(extensions),
			...this.charClasses.get(),
			...this.special.get(),
			...this.typeMatch.get(),
			...this.quantifiers.get(),
			...this.elementary.get()
		]
	}

	constructor(factory: IRegexFactory) {
		this.quantifiers = new QuantifierCompilerTable(factory)
		this.charClasses = new ClassCompilerTable(factory)
		this.toplevel = new ToplevelCompilerTable(factory)
		this.groups = new GroupCompilerTable(factory, this.toplevel)
		this.special = new SpecialCharacterTable(factory)
		this.typeMatch = new TypeMatchCompilerTable(factory)
		this.elementary = new ElementaryCompilerTable(factory)
	}
}
