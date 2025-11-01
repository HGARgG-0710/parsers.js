import assert from "assert"
import type {
	IConcreteRegexFinalizer,
	IPeekableStream,
	IRegexMatcher,
	IRegexPartBuilder,
	IValidNodeType
} from "../interfaces.js"
import { RegexStorage } from "../internal/RegexStorage.js"
import { ArrayBuilder } from "./ArrayBuilder.js"

export class Regex<T = any> {
	private readonly final: IRegexMatcher

	matchAt(stream: IPeekableStream<T>) {
		return this.final.match(stream)
	}

	constructor(source: string, finalizer: IConcreteRegexFinalizer) {
		this.final = RegexStorage.instance.get(source, finalizer)
	}
}

export namespace Regex {
	// * Plan for the algorithm:
	// ! 	1. IRegexMatcher.match implementation:
	// * 		1. it relies upon:
	// 				1. traversing a list of LINKED "State" objects
	// 				2. checking for whether ANY ONE OF THEM is the "Match"
	// ^			CONCLUSION:
	// * 				1. one needs to BUILD a list of "State" objects [WHICH ARE LINKED-LISTS *themselves*]:
	// ! 					1. One needs to have `IRegexBuilder` CREATE the structure of:
	// * 						1. Either
	// * 						2. Concat
	// * 						3. OneOrMany
	// * 						4. Optional
	// * 						5. Char
	// * 						6. NoneOrMany
	// * 						7. TokenType
	// ! 					2. One needs the ".finalize(): IRegexMatcher" method to:
	// * 						1. CONVERT this "high-level" 7-structure into a LINKED LIST of "State"s
	// ! 						2. Thus, a NEW component - `NFAFlattener` - it accepts the "RawRegex" form,
	// * 						3. AND *flattens* it
	// * 				2. "State" must have a child class of `Match`
	// ! 					1. "State" has an `get .isMatch(): bool` get-accessor, returning a constant
	// ! 						The "Match" child OVERRIDES it to return `true` (the default value is `false`).
	// ^					CONCLUSION: `State` is abstract has two children:
	// * 							1. BasicState (`.isMatch = false`, HAS a *character/token-type*),
	// * 							2. EitherState (`.isMatch = false`)
	// * 							3. Match (`.isMatch = true`)
	// * 				3. ABOUT the `IRegexBuilder` interface:
	// ! 					1. It SHOULD be rewritten in terms of the "RawRegex.ts" classes - meaning,
	// * 						THAT EVERY IMPLEMENTATION should be in terms of *these* abstractions, since
	// * 						THEY'RE *UNIVERSAL*, and no matter WHICH syntax creates a tree used by `RegexCompiler`,
	// * 						the resulting "RawRegex" format should *ALWAYS be the same*.
	// ! 						The only thing that differs, in the end, is the "State" - an IMPLEMENTATION DETAIL of the
	// ! 						`NFAMatcher`
	// ^ 				4. CONCLUSION: the "RawRegex" should ACTUALLY be PUBLIC CLASSES (i.e., *only* the "finalize" is THE IMPLEMENTAITON DETAIL).
	// ^ 				5. CONCLUSION: the "RawRegex" classes MUST share a common `abstract class`! This is the type that is PRODUCED by the `IRegexBuilder` interface...
	// ^^^				6. Conclusion: remove the `IRegexBuilder` interface - replace it with a CONCRETE `RawRegexBuilder` class,
	// * 					1. And a NEW interface (one that is NOW USED by the `Regex`):
	// ! 						1. and one that is PASSED AS ARGUMENT *instead* of the `IRegexBuilder` instance
	// * 							1. IConcreteRegexFinalizer - the replacement for the *key* `finalize(): IRegexMatcher` method
	// ! 							2. now, it's become `.concrete(raw: RawRegex): IRegexMatcher` - this encapsulates the inner workings of a given implementation
	// * 							3. RawRegexBuilder IS A SINGLETON!
	// ! 				7. NEED TO USE THE `Flyweight` pattern for the `Char` objects!!!

	export abstract class Raw {}

	export namespace Raw {
		export abstract class Builder implements IRegexPartBuilder {
			private readonly arrBuilder = new ArrayBuilder<Raw>()

			addItem(item: IRegexPartBuilder) {
				this.arrBuilder.push(item)
			}

			protected get() {
				return this.arrBuilder.get()
			}

			abstract finish(): Raw
		}

		export class Either extends Raw {
			private readonly options: Raw[]

			constructor(...options: Raw[]) {
				super()
				this.options = options
			}
		}

		export namespace Either {
			export class Builder extends Raw.Builder {
				finish(): Raw {
					return new Either(...this.get())
				}
			}
		}

		export class Catenation extends Raw {
			private readonly items: Raw[]

			constructor(...items: Raw[]) {
				super()
				this.items = items
			}
		}

		export namespace Catenation {
			export class Builder extends Raw.Builder {
				finish(): Regex.Raw {
					return new Catenation(...this.get())
				}
			}
		}

		export class Optional extends Raw {
			constructor(private readonly item: Raw) {
				super()
			}
		}

		export class NoneOrMore extends Raw {
			constructor(private readonly item: Raw) {
				super()
			}
		}

		export class Char extends Raw {
			constructor(private readonly char: string) {
				super()
				assert(char.length === 1)
			}
		}

		export class TokenType extends Raw {
			constructor(private readonly type: IValidNodeType) {
				super()
			}
		}
	}
}
