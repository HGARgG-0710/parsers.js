import type { IGettablePattern, IPattern } from "./interfaces.js"
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

export abstract class InitializablePattern<Type = any>
	extends OptionalPattern<Type>
	implements IGettablePattern<Type>
{
	init(value?: Type) {
		this.value = value
	}

	get() {
		return this.value!
	}
}

export abstract class BasicPattern<Type = any> implements IPattern<Type> {
	value: Type
	constructor(value?: Type) {
		setValue(this, value)
	}
}
