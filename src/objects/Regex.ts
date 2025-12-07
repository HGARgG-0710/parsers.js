import assert from "assert"
import type {
	IConcreteRegexFinalizer,
	IPeekableStream,
	IRawRegexVisitor,
	IRegexMatcher,
	IRegexPartBuilder,
	IValidNodeType
} from "../interfaces.js"
import { NFARegexFinalizer as _NFARegexFinalizer } from "../internal/RegexNFA/Finalizer.js"
import { RegexStorage } from "../internal/RegexStorage.js"
import { ArrayCollection } from "./ArrayCollection.js"
import { AutoMap } from "./AutoMap.js"

export class Regex<T = any> {
	private readonly final: IRegexMatcher

	matchAt(stream: IPeekableStream<T>) {
		return this.final.match(stream)
	}

	constructor(
		source: string,
		finalizer: IConcreteRegexFinalizer = _NFARegexFinalizer.instance
	) {
		this.final = RegexStorage.instance.get(source, finalizer)
	}
}

export namespace Regex {
	export const NFARegexFinalizer = _NFARegexFinalizer

	export abstract class Raw {
		abstract accept<T>(visitor: IRawRegexVisitor<T>): T
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

		export class Catenation extends Mult {
			accept<T = any>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleCatenation(this)
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

		export class IgnoreCase extends Mult {
			accept<T = any>(visitor: IRawRegexVisitor<T>): T {
				return visitor.handleIgnoreCase(this)
			}
		}

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
	}
}
