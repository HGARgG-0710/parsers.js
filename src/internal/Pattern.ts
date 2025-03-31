import type { IGettable, IPattern, IPointer } from "../interfaces.js"

import { type } from "@hgargg-0710/one"
import { setValue } from "../utils.js"
const { isUndefined } = type

export abstract class ProtectedPattern<Type = any> {
	protected value: Type
	constructor(value: Type) {
		this.value = value
	}
}

export abstract class OptionalPattern<Type = any> {
	protected value?: Type
	constructor(value?: Type) {
		if (!isUndefined(value)) this.value = value
	}
}

export abstract class InitializablePattern<Type = any>
	extends OptionalPattern<Type>
	implements IGettable<Type>
{
	init(value?: Type) {
		this.value = value
	}

	get() {
		return this.value!
	}
}

export abstract class BasicPattern<Type = any> implements IPointer<Type> {
	value: Type
	constructor(value: Type) {
		setValue(this, value)
	}
}
export abstract class Pattern<Type = any> implements IPattern<Type> {
	value?: Type
	constructor(value?: Type) {
		setValue(this, value)
	}
}
