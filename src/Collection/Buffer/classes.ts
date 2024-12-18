import type { UnfreezableBuffer } from "./interfaces.js"
import { TypicalUnfreezable } from "./abstract.js"

export class UnfreezableArray<Type = any>
	extends TypicalUnfreezable<Type>
	implements UnfreezableBuffer<Type>
{
	protected value: Type[]

	push(...elements: Type[]) {
		if (!this.isFrozen) this.value.push(...elements)
		return this
	}

	constructor(value: Type[] = []) {
		super(value)
	}
}

export class UnfreezableString
	extends TypicalUnfreezable<string>
	implements UnfreezableBuffer<string>
{
	protected value: string

	push(...strings: string[]) {
		if (!this.isFrozen) this.value += strings.join("")
		return this
	}

	constructor(value: string = "") {
		super(value)
	}
}
