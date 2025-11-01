import { array } from "@hgargg-0710/one"
import assert from "assert"
import type { IRegexPartBuilder, IValidNodeType } from "../../interfaces.js"
import { Regex } from "../../objects.js"

const { Either, Char, Catenation, Optional, NoneOrMore, TokenType } = Regex.Raw
const { numbers } = array

export interface IRegexBuilder {
	begin(): void
	addItem(item: Regex.Raw): void

	disjunction(): IRegexPartBuilder
	catenation(): IRegexPartBuilder
	ignoreCase(): IRegexPartBuilder
	lookahead(): IRegexPartBuilder
	charClass(): IRegexPartBuilder
	negCharClass(): IRegexPartBuilder

	anything(): Regex.Raw
	word(): Regex.Raw
	digit(): Regex.Raw
	space(): Regex.Raw
	newline(): Regex.Raw
	literal(x: string): Regex.Raw
	charRange(from: string, to: string): Regex.Raw
	unicodeChar(hex: string): Regex.Raw
	typeMatch(type: IValidNodeType): Regex.Raw
	greedy(item: Regex.Raw): Regex.Raw
	nonGreedy(item: Regex.Raw): Regex.Raw
	noneOrMore(item: Regex.Raw): Regex.Raw
	optional(item: Regex.Raw): Regex.Raw
	repeat(item: Regex.Raw, times: number): Regex.Raw

	get(): Regex.Raw
}

export class RawRegexBuilder implements IRegexBuilder {
	static readonly instance = new RawRegexBuilder()

	private raw: Regex.Raw | null = null

	begin(): void {
		this.raw = null
	}

	addItem(item: Regex.Raw): void {
		this.raw = item
	}

	disjunction(): IRegexPartBuilder {
		return new Either.Builder()
	}

	catenation(): IRegexPartBuilder {
		return new Catenation.Builder()
	}

	ignoreCase(): IRegexPartBuilder {
		// ! MISSING A CLASS - need to register that the underlying A/a, Z/z, etc... distinction IS LOST!
	}

	// TODO: CHANGE the "lookahead" name to "noCapture" [i.e. - ]
	lookahead(): IRegexPartBuilder {
		// ! MISSING A CLASS - one needs to REGISTER that the stuff *inside* the current one WILL NOT be matched!!!
		// * Unlike the classic Thompson's Construction matching algtorithm, one ALSO must collect the ITEMS FROM THE UNDERLYING `IStream`!!!
	}

	charClass(): IRegexPartBuilder {
		return new Either.Builder()
	}

	negCharClass(): IRegexPartBuilder {
		// ! MISSING A CLASS - `NoneOf` - the opposite of `Either`; Use the `NoneOf.Builder` class...
	}

	anything(): Regex.Raw {
		// ! Conclusion: we're missing a class here...
		// * Name it `Regex.Raw.Anything` - matches NOT ONLY "any characters", but "any tokens"...
	}

	word(): Regex.Raw {
		// ! This one is tricky...
		// ? Options...
		// * 1. use [a-zA-Z0-9_] - simple, classic, efficient BUT -
		// * 2. use a GENERAL unicode-version - MUCH harder to implement, MUCH greater practical benefit - auto-enables user to work with Unicode strings...
		// % Option 1. has good performance, but poor generality
		// % Option 2. has perfect generality, but abysmal performance
		// ^ CONCLUSION:
		// * 	0. Use Option 2, BUT...
		// ! 	1. Naive implementation is ABSURD. We HAVE to implement this *somehow* else
		// ! 	2. CONCLUSION: need a new `CharCodeRange` class for `RawRegex`, which:
		// * 		1. checks a character's `x.charCodeAt(0)` to be within ONE OF THE ACCEPTED RANGES!
		// * 	3. This *will* offer competitive performance relative to the naive "Either" solution...
	}

	digit(): Regex.Raw {
		return new Either(...numbers(10).map((n) => new Char(n.toString())))
	}

	space(): Regex.Raw {
		return new Either(
			new Char(" "),
			new Char("\t"),
			this.newline(),
			new Char("\v"),
			new Char("\f")
		)
	}

	newline(): Regex.Raw {
		return new Either(
			new Char("\n"),
			new Catenation(new Char("\r"), new Char("\n"))
		)
	}

	literal(x: string): Regex.Raw {
		return new Char(x)
	}

	charRange(from: string, to: string): Regex.Raw {
		// ! Same thing as before - CHAR RANGES, this is a SEPARATE class altogether...
	}

	unicodeChar(hex: string): Regex.Raw {
		return new Char(String.fromCodePoint(parseInt(hex, 16)))
	}

	typeMatch(type: IValidNodeType): Regex.Raw {
		return new TokenType(type)
	}

	greedy(item: Regex.Raw): Regex.Raw {
		// ! Lack a type of items - either the `NonGreedy` or `Greedy` class (or both...)
	}

	nonGreedy(item: Regex.Raw): Regex.Raw {
		// ! lack of types...
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

	get(): Regex.Raw {
		assert(this.raw)
		return this.raw
	}

	private constructor() {}
}
