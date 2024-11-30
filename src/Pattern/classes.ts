import type { Flushable, Pattern } from "./interfaces.js"
import { setValue } from "./utils.js"

export abstract class BasicPattern<Type = any> implements Pattern<Type> {
	value?: Type
	constructor(value?: Type) {
		setValue(this, value)
	}
}

export abstract class FlushablePattern<Type = any>
	extends BasicPattern<Type>
	implements Flushable
{
	abstract flush(): void
	constructor(value?: Type) {
		super(value)
		this.flush()
	}
}
