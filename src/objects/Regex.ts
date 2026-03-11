import { array, type } from "@hgargg-0710/one"
import assert from "assert"
import type {
	IConcreteRegexFinalizer,
	ILinePrintable,
	IPeekableStream,
	IRawRegexVisitor,
	IRegexCompilerTypeTableBindableRow,
	IRegexFactory,
	IRegexMatcher,
	IRegexParserBindableTableRow,
	IRegexPartBuilder,
	IValidNodeType
} from "../interfaces.js"
import { NFARegexFinalizer } from "../internal/Regex/NFA/Finalizer.js"
import { RegexStorage } from "../internal/Regex/Storage.js"
import { ArrayCollection } from "./ArrayCollection.js"
import { AutoMap } from "./AutoMap.js"

const { numbers } = array
const { isUndefined } = type

function tabLines(lines: string[]) {
	return lines.map((line) => `\t${line}`)
}

function tabItem(item: ILinePrintable) {
	return item.printLines(true)
}

export class Regex<T = any> {
	private readonly matcher: IRegexMatcher

	matchAt(stream: IPeekableStream<T>) {
		return this.matcher.match(stream)
	}

	toString() {
		return this.source
	}

	constructor(
		private readonly source: string,
		config: Regex.Config = Regex.Config.default
	) {
		this.matcher = RegexStorage.instance.get(source, config)
	}
}

export namespace Regex {
	export const NFAFinalizer = NFARegexFinalizer

	export class ExtensionMap {
		private readonly defaults: Map<string, any>
		private readonly defined: Map<string, any>

		protected getInitDefaults(): array.Pairs<string, any> {
			return [
				["ignoreCase", false],
				["noCapture", false]
			]
		}

		protected getInitDefined(): array.Pairs<string, any> {
			return []
		}

		set(propName: string, value: any) {
			this.defined.set(propName, value)
		}

		getDefined(propName: string) {
			return this.defined.get(propName)
		}

		get(propName: string) {
			assert(this.defaults.has(propName))
			const lookupTop = this.defined.get(propName)
			if (!isUndefined(lookupTop)) return lookupTop
			return this.defaults.get(propName)
		}

		*[Symbol.iterator]() {
			for (const [propName, value] of this.defined)
				yield [propName, value]
		}

		from(map: ExtensionMap): this {
			for (const [definedProp, value] of map) this.set(definedProp, value)
			return this
		}

		constructor() {
			this.defaults = new Map<string, any>(this.getInitDefaults())
			this.defined = new Map<string, any>(this.getInitDefined())
		}
	}

	// ! pre-doc: the `setExtensionMap` is INTENDED to be used INSIDE the user-provided `IRegexFactory`
	// ! 	This way, there is a GREAT deal of coupling between the different pieces of the extension code.
	// ! 	This is (unfortunately) the result of needing to synchronize behaviour of multiple components
	// 		(i.e., as a general rule, customizing a list of components which are coupled to one another
	// 		creates respective coupling inside the customization code...)
	// ! ALSO - the `setExtensionMap` MUST be called BEFORE the `Regex.*.Builder.finish()`,
	// ! 	since THAT is where 'noCapture()/ignoreCase()' are both called!
	export abstract class Raw implements ILinePrintable {
		abstract accept<T>(visitor: IRawRegexVisitor<T>): T

		protected abstract printLinesRaw(): string[]

		printLines(tab: boolean = false): string[] {
			const raw = this.printLinesRaw()
			return tab ? tabLines(raw) : raw
		}

		private extMap = new ExtensionMap()

		inheritExtensions(map: ExtensionMap) {
			this.extMap.from(map)
			return this
		}

		set(extName: string, value: any) {
			this.extMap.set(extName, value)
			return this
		}

		get extensions() {
			return this.extMap
		}
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
				.default
		) {}
	}

	export namespace Raw {
		export abstract class Mult extends Raw {
			readonly items: Raw[]

			protected abstract get printName(): string

			protected printLinesRaw(): string[] {
				return [
					`${this.printName} [`,
					...this.items.map((item) => tabItem(item)).flat(),
					"]"
				]
			}

			override inheritExtensions(map: ExtensionMap): this {
				for (const item of this.items) item.inheritExtensions(map)
				return super.inheritExtensions(map)
			}

			override set(extName: string, value: any): this {
				for (const x of this.items) x.set(extName, value)
				return this.setShallow(extName, value)
			}

			setShallow(extName: string, value: any) {
				return super.set(extName, value)
			}

			// ! pre-doc: THIS IS A DEFAULT, the user is supposed to OVERRIDE IT... [unless they're not]
			accept<T = any>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleCatenationLike(this.items)
			}

			constructor(...items: Raw[]) {
				super()
				this.items = items
			}
		}

		export namespace Mult {
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
		}

		export class Either extends Mult {
			protected override get printName(): string {
				return "Either"
			}

			override accept<T = any>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleEither(this)
			}
		}

		export namespace Either {
			export class Builder extends Mult.Builder {
				finish(): Raw {
					return new Either(...this.get())
				}
			}
		}

		export class Catenation extends Mult {
			protected override get printName(): string {
				return "Catenation"
			}
		}

		export namespace Catenation {
			export class Builder extends Mult.Builder {
				finish(): Regex.Raw {
					return new Catenation(...this.get())
				}
			}
		}

		export abstract class SinglePrinted extends Raw {
			protected abstract get printName(): string

			protected printLinesRaw(): string[] {
				return [
					`${this.printName} {`,
					...tabLines([`item =`, ...tabItem(this.item)]),
					"}"
				]
			}

			constructor(readonly item: Raw) {
				super()
			}
		}

		export class Optional extends SinglePrinted {
			protected override get printName(): string {
				return "Optional"
			}

			accept<T = any>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleOptional(this)
			}
		}

		export class NoneOrMore extends SinglePrinted {
			protected override get printName(): string {
				return "NoneOrMore"
			}

			accept<T = any>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleNoneOrMore(this)
			}
		}

		export class Char extends Raw {
			private static readonly instances = new AutoMap(
				(char: string) => new Char(char)
			)

			static make(char: string) {
				return this.instances.get(char)
			}

			protected printLinesRaw(): string[] {
				return ["Char {", `\tchar = '${this.char}'`, "}"]
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
			protected printLinesRaw(): string[] {
				return [
					"TokenType {",
					`\ttype = ${JSON.stringify(this.type)}`,
					"}"
				]
			}

			accept<T = any>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleTokenType(this)
			}

			constructor(readonly type: IValidNodeType) {
				super()
			}
		}

		export class CodeRange extends Raw {
			protected printLinesRaw(): string[] {
				return [
					"CodeRange {",
					`\tfrom = ${this.from}`,
					`\tto = ${this.to}`,
					"}"
				]
			}

			accept<T = any>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleCodeRange(this)
			}

			constructor(
				readonly from: number,
				readonly to: number
			) {
				super()
			}
		}

		export class Anything extends Raw {
			protected printLinesRaw(): string[] {
				return ["Anything {}"]
			}

			accept<T = any>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleAnything(this)
			}
		}

		export class NoneOf extends Mult {
			protected override get printName(): string {
				return "NoneOf"
			}

			override accept<T = any>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleNoneOf(this)
			}
		}

		export namespace NoneOf {
			export class Builder extends Mult.Builder {
				finish(): Raw {
					return new NoneOf(...this.get())
				}
			}
		}

		export class IgnoreCase extends Mult {
			protected override get printName(): string {
				return "IgnoreCase"
			}
		}

		export namespace IgnoreCase {
			export class Builder extends Mult.Builder {
				finish(): Raw {
					return new IgnoreCase(...this.get()).set("ignoreCase", true)
				}
			}
		}

		export class NoCapture extends Mult {
			protected override get printName(): string {
				return "NoCapture"
			}
		}

		export namespace NoCapture {
			export class Builder extends Mult.Builder {
				finish(): Raw {
					return new NoCapture(...this.get()).set("noCapture", true)
				}
			}
		}

		export class NonBoundary extends Mult {
			protected override get printName(): string {
				return "NonBoundary"
			}

			override accept<T>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleNonBoundary(this)
			}
		}

		export namespace NonBoundary {
			export class Builder extends Mult.Builder {
				finish(): Raw {
					return new NonBoundary(...this.get())
				}
			}
		}

		export class Boundary extends Mult {
			protected override get printName(): string {
				return "Boundary"
			}

			override accept<T>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleBoundary(this)
			}
		}

		export namespace Boundary {
			export class Builder extends Mult.Builder {
				finish(): Raw {
					return new Boundary(...this.get())
				}
			}
		}

		export class UnicodeProperty extends Raw {
			protected printLinesRaw(): string[] {
				return [
					"UnicodeProperty {",
					`\tpropName = ${this.propName}`,
					`\tvalue = ${this.value}`,
					"}"
				]
			}

			override accept<T>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleUnicodeProperty(this)
			}

			constructor(
				readonly propName: string,
				readonly value: string
			) {
				super()
			}
		}

		export namespace UnicodeProperty {
			export class Alias extends Raw {
				protected printLinesRaw(): string[] {
					return [
						"UnicodeProperty.Alias {",
						`\tpropName = ${this.propName}`,
						"}"
					]
				}

				override accept<T>(visitor: IRawRegexVisitor<T>): T {
					return visitor.handleUnicodePropertyAlias(this)
				}

				constructor(readonly propName: string) {
					super()
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
			
			// * note: we're parsing here and not in 'RegexParser' since 
			// 	interpretation of the hex id is up to the factory, and not 
			// 	the front-end parser - its job is merely to correctly represent
			// 	the raw data provided by the user, *not* to assign a definitive 
			// 	meaning of it within the application
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

			unicodeProperty(propName: string, value: string): Regex.Raw {
				return new UnicodeProperty(propName, value)
			}

			unicodePropertyAlias(propName: string): Regex.Raw {
				return new UnicodeProperty.Alias(propName)
			}

			protected constructor() {}
		}
	}
}
