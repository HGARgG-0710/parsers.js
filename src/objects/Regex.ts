import { array } from "@hgargg-0710/one"
import assert from "assert"
import type {
	IConcreteRegexFinalizer,
	IPeekableStream,
	IRawRegexVisitor,
	IRegexCompilerTypeTableBindableRow,
	IRegexFactory,
	IRegexMatcher,
	IRegexParserBindableTableRow,
	IRegexPartBuilder,
	IValidNodeType
} from "../interfaces.js"
import { charAfter, charBefore } from "../internal/CodePoint.js"
import { NFARegexFinalizer } from "../internal/RegexNFA/Finalizer.js"
import { RegexStorage } from "../internal/RegexStorage.js"
import { ArrayCollection } from "./ArrayCollection.js"
import { AutoMap } from "./AutoMap.js"

const { numbers } = array

export class Regex<T = any> {
	private readonly final: IRegexMatcher

	matchAt(stream: IPeekableStream<T>) {
		return this.final.match(stream)
	}

	constructor(source: string, config: Regex.Config = Regex.Config.default) {
		this.final = RegexStorage.instance.get(source, config)
	}
}

export namespace Regex {
	export const NFAFinalizer = NFARegexFinalizer

	export abstract class Raw {
		abstract accept<T>(visitor: IRawRegexVisitor<T>): T
	}

	export class Extension {
		constructor(
			readonly getParserTableRow?: IRegexParserBindableTableRow, 
			readonly getCompilerTableRow?: IRegexCompilerTypeTableBindableRow<any>
		) {}
	}

	// ! pre-doc: this thing MUST be extended in order to be used.
	// ! 	The Singleton pattern is a PARTICULARLY good fit here,
	// ! 	since instances *SHOULD* be cached for better startup performace.
	export class Config {
		static readonly default = new Config()

		protected constructor(
			readonly extensions: Extension[] = [],
			readonly factory: IRegexFactory = Regex.Raw.Factory.instance,
			readonly finalizer: IConcreteRegexFinalizer = Regex.NFAFinalizer
				.instance
		) {}
	}

	export namespace Raw {
		export abstract class Builder implements IRegexPartBuilder {
			private readonly items = new ArrayCollection<Raw>()

			addItem(item: Raw) {
				this.items.push(item)
				return this
			}

			protected get() {
				return this.items.get() as Raw[]
			}

			abstract finish(): Raw
		}

		export abstract class Mult extends Raw {
			readonly items: Raw[]

			// ! pre-doc: THIS IS A DEFAULT, the user is supposed to OVERRIDE IT... [unless they're not]
			accept<T = any>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleCatenationLike(this.items)
			}

			constructor(...items: Raw[]) {
				super()
				this.items = items
			}
		}

		export class Either extends Mult {
			accept<T = any>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleEither(this)
			}
		}

		export namespace Either {
			export class Builder extends Raw.Builder {
				finish(): Raw {
					return new Either(...this.get())
				}
			}
		}

		export class Catenation extends Mult {}

		export namespace Catenation {
			export class Builder extends Raw.Builder {
				finish(): Regex.Raw {
					return new Catenation(...this.get())
				}
			}
		}

		export class Optional extends Raw {
			accept<T = any>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleOptional(this)
			}

			constructor(readonly item: Raw) {
				super()
			}
		}

		export class NoneOrMore extends Raw {
			accept<T = any>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleNoneOrMore(this)
			}

			constructor(readonly item: Raw) {
				super()
			}
		}

		export class Char extends Raw {
			private static readonly instances = new AutoMap(
				(char: string) => new Char(char)
			)

			static make(char: string) {
				return this.instances.get(char)
			}

			accept<T = any>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleChar(this)
			}

			private constructor(readonly char: string) {
				super()
				assert(char.length === 1)
			}
		}

		export class TokenType extends Raw {
			accept<T = any>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleTokenType(this)
			}

			constructor(readonly type: IValidNodeType) {
				super()
			}
		}

		export class CodeRange extends Raw {
			accept<T = any>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleCodeRange(this)
			}

			constructor(readonly from: number, readonly to: number) {
				super()
			}
		}

		export class Anything extends Raw {
			accept<T = any>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleAnything(this)
			}
		}

		export class NoneOf extends Mult {
			accept<T = any>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleNoneOf(this)
			}
		}

		export namespace NoneOf {
			export class Builder extends Raw.Builder {
				finish(): Raw {
					return new NoneOf(...this.get())
				}
			}
		}

		export class IgnoreCase extends Mult {}

		export namespace IgnoreCase {
			export class Builder extends Raw.Builder {
				finish(): Raw {
					return new IgnoreCase(...this.get())
				}
			}
		}

		export class NoCapture extends Mult {
			accept<T = any>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleNoCapture(this)
			}
		}

		export namespace NoCapture {
			export class Builder extends Raw.Builder {
				finish(): Raw {
					return new NoCapture(...this.get())
				}
			}
		}

		export class NonBoundary extends Mult {
			accept<T>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleNonBoundary(this)
			}
		}

		export namespace NonBoundary {
			export class Builder extends Raw.Builder {
				finish(): Raw {
					return new NonBoundary(...this.get())
				}
			}
		}

		export class Boundary extends Mult {
			accept<T>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleBoundary(this)
			}
		}

		export namespace Boundary {
			export class Builder extends Raw.Builder {
				finish(): Raw {
					return new Boundary(...this.get())
				}
			}
		}

		export class Factory implements IRegexFactory {
			static readonly instance: IRegexFactory = new Factory()

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

			boundaryClass(): IRegexPartBuilder {
				return new Boundary.Builder()
			}

			negBoundaryClass(): IRegexPartBuilder {
				return new NonBoundary.Builder()
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
				return new Either(from, this.charRange(charAfter("\n"), to))
			}

			charToNewlineRange(from: string, to: Regex.Raw): Regex.Raw {
				return new Either(this.charRange(from, charBefore("\n")), to)
			}

			protected constructor() {}
		}
	}
}
