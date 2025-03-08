import type { Pattern } from "./interfaces.js"
import type { Flushable } from "src/interfaces.js"
import { setValue } from "./utils.js"

import { type } from "@hgargg-0710/one"
const { isUndefined } = type

export abstract class ProtectedPattern<Type = any> {
	protected value: Type
	constructor(value: Type) {
		this.value = value
	}
}

abstract class OptionalPattern<Type = any> {
	protected value?: Type
	constructor(value?: Type) {
		if (!isUndefined(value)) this.value = value
	}
}

export abstract class InitializablePattern<Type = any> extends OptionalPattern<Type> {
	init(value?: Type) {
		this.value = value
	}

	get() {
		return this.value
	}
}

export abstract class BasicPattern<Type = any> implements Pattern<Type> {
	value: Type
	constructor(value?: Type) {
		setValue(this, value)
	}
}

export abstract class FlushablePattern<Type = any>
	extends InitializablePattern<Type>
	implements Flushable
{
	abstract flush(): void
	constructor(value?: Type) {
		super(value)
		this.flush()
	}
}
