import type { Pattern, Flushable } from "./interfaces.js"
import { setValue } from "./utils.js"

export abstract class ProtectedPattern<Type = any> {
	protected value: Type
	constructor(value: Type) {
		this.value = value
	}
}

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
