import type { IUnfreezableBuffer } from "./interfaces.js"
import type { IIndexed } from "../../interfaces.js"

import { IterableCollection } from "src/internal/Collection.js"

import { array } from "@hgargg-0710/one"

abstract class TypicalUnfreezable<Type = any> extends IterableCollection<Type> {
	isFrozen: boolean = false;

	["constructor"]: new (value?: IIndexed<Type>) => typeof this

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

	copy() {
		return new this.constructor(this.value)
	}

	emptied() {
		return new this.constructor()
	}
}

export class UnfreezableArray<Type = any>
	extends TypicalUnfreezable<Type>
	implements IUnfreezableBuffer<Type>
{
	protected value: Type[]

	push(...elements: Type[]) {
		if (!this.isFrozen) this.value.push(...elements)
		return this
	}

	get() {
		return super.get() as readonly Type[]
	}

	copy() {
		return new this.constructor(array.copy(this.value))
	}

	constructor(value: Type[] = []) {
		super(value)
	}
}

export class UnfreezableString
	extends TypicalUnfreezable<string>
	implements IUnfreezableBuffer<string>
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
