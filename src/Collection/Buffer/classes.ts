import type { UnfreezableBuffer } from "./interfaces.js"
import { IterableCollection } from "../abstract.js"

abstract class TypicalUnfreezable<Type = any> extends IterableCollection<Type> {
	isFrozen: boolean = false

	unfreeze() {
		this.isFrozen = false
		return this
	}

	freeze() {
		this.isFrozen = true
		return this
	}

	read(i: number) {
		return this.value![i] as Type
	}

	get size() {
		return this.value!.length
	}
}

export class UnfreezableArray<Type = any>
	extends TypicalUnfreezable<Type>
	implements UnfreezableBuffer<Type>
{
	protected value: Type[]

	push(...elements: Type[]) {
		if (!this.isFrozen) this.value.push(...elements)
		return this
	}

	get() {
		return super.get() as readonly Type[]
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

	get() {
		return super.get() as string
	}

	push(...strings: string[]) {
		if (!this.isFrozen) this.value += strings.join("")
		return this
	}

	constructor(value: string = "") {
		super(value)
	}
}
