import type { Flushable, Pattern } from "./interfaces.js"
import { setValue } from "./utils.js"

export abstract class BasicPattern<Type = any> implements Pattern<Type> {
	value: Type
	constructor(value: Type) {
		setValue(this, value)
	}
}

export abstract class FlushablePattern<Type = any>
	extends BasicPattern<Type>
	implements Flushable
{
	flush: () => void
	constructor(value: Type) {
		super(value)
		this.flush()
	}
}

export * as Collection from "./Collection/classes.js"
export * as EliminablePattern from "./EliminablePattern/classes.js"
export * as EnumSpace from "./EnumSpace/classes.js"
export * as Token from "./Token/classes.js"
export * as TokenizablePattern from "./TokenizablePattern/classes.js"
export * as ValidatablePattern from "./ValidatablePattern/classes.js"
