import { array } from "@hgargg-0710/one"
import type { IRegexPartBuilder, IValidNodeType } from "../../interfaces.js"
import { Regex } from "../../objects.js"
import { CodePointNavigator } from "../CodePointNavigator.js"

const {
	Either,
	Char,
	Catenation,
	Optional,
	NoneOrMore,
	TokenType,
	CodeRange,
	Anything,
	NoneOf,
	IgnoreCase,
	NoCapture
} = Regex.Raw

const { numbers } = array

export interface IRegexFactory {
	disjunction(): IRegexPartBuilder
	catenation(): IRegexPartBuilder
	ignoreCase(): IRegexPartBuilder
	noCapture(): IRegexPartBuilder
	charClass(): IRegexPartBuilder
	negCharClass(): IRegexPartBuilder

	anything(): Regex.Raw
	word(): Regex.Raw
	digit(): Regex.Raw
	space(): Regex.Raw
	newline(): Regex.Raw
	literal(x: string): Regex.Raw.Char
	charRange(from: string, to: string): Regex.Raw
	newlineToCharRange(from: Regex.Raw, to: string): Regex.Raw
	charToNewlineRange(from: string, to: Regex.Raw): Regex.Raw
	unicodeChar(hex: string): Regex.Raw.Char
	typeMatch(type: IValidNodeType): Regex.Raw
	noneOrMore(item: Regex.Raw): Regex.Raw
	optional(item: Regex.Raw): Regex.Raw
	repeat(item: Regex.Raw, times: number): Regex.Raw
}

export class RawRegexFactory implements IRegexFactory {
	static readonly instance = new RawRegexFactory()

	disjunction(): IRegexPartBuilder {
		return new Either.Builder()
	}

	catenation(): IRegexPartBuilder {
		return new Catenation.Builder()
	}

	ignoreCase(): IRegexPartBuilder {
		return new IgnoreCase.Builder()
	}

	noCapture(): IRegexPartBuilder {
		return new NoCapture.Builder()
	}

	charClass(): IRegexPartBuilder {
		return new Either.Builder()
	}

	negCharClass(): IRegexPartBuilder {
		return new NoneOf.Builder()
	}

	anything(): Regex.Raw {
		return new Anything()
	}

	word(): Regex.Raw {
		return new Either(
			this.charRange("a", "z"),
			this.charRange("A", "Z"),
			this.digit(),
			this.literal("_")
		)
	}

	digit(): Regex.Raw {
		return this.charRange("0", "9")
	}

	space(): Regex.Raw {
		return new Either(
			Char.make(" "),
			Char.make("\t"),
			this.newline(),
			Char.make("\v"),
			Char.make("\f")
		)
	}

	newline(): Regex.Raw {
		return new Either(
			Char.make("\n"),
			new Catenation(Char.make("\r"), Char.make("\n"))
		)
	}

	literal(x: string) {
		return Char.make(x)
	}

	charRange(from: string, to: string): Regex.Raw {
		return new CodeRange(from.codePointAt(0)!, to.codePointAt(0)!)
	}

	// * note: we're parsing here and not inside `RegexParser` since
	// * this reduces the amount of transformation logic inside the
	// * parser (purpose of `RegexParser` is only to produce a front-facing
	// * AST, one to be later re-built into the `Regex.Raw` form).
	unicodeChar(hex: string) {
		return Char.make(String.fromCodePoint(parseInt(hex, 16)))
	}

	typeMatch(type: IValidNodeType): Regex.Raw {
		return new TokenType(type)
	}

	noneOrMore(item: Regex.Raw): Regex.Raw {
		return new NoneOrMore(item)
	}

	optional(item: Regex.Raw): Regex.Raw {
		return new Optional(item)
	}

	repeat(item: Regex.Raw, times: number): Regex.Raw {
		return new Catenation(...numbers(times).map(() => item))
	}

	newlineToCharRange(from: Regex.Raw, to: string): Regex.Raw {
		return new Either(
			from,
			this.charRange(CodePointNavigator.charAfter("\n"), to)
		)
	}

	charToNewlineRange(from: string, to: Regex.Raw): Regex.Raw {
		return new Either(
			this.charRange(from, CodePointNavigator.charBefore("\n")),
			to
		)
	}

	private constructor() {}
}
