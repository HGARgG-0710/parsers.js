import { array, type } from "@hgargg-0710/one"
import assert from "assert"
import { IterableCollection } from "src/internal/Collection/IterableCollection.js"
import type { IIndexed } from "../../interfaces.js"
import type { IUnfreezableBuffer } from "./interfaces.js"

const { isString, isArray } = type

abstract class TypicalUnfreezable<Type = any> extends IterableCollection<Type> {
	isFrozen = false;

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
		return this.collection![i] as Type
	}

	copy() {
		return new this.constructor(this.collection)
	}

	emptied() {
		return new this.constructor()
	}
}

export class UnfreezableArray<Type = any>
	extends TypicalUnfreezable<Type>
	implements IUnfreezableBuffer<Type>
{
	protected collection: Type[]

	push(...elements: Type[]) {
		if (!this.isFrozen) this.collection.push(...elements)
		return this
	}

	get() {
		return super.get() as readonly Type[]
	}

	copy() {
		return new this.constructor(array.copy(this.collection))
	}

	write(i: number, value: Type) {
		if (!this.isFrozen) this.collection[i] = value
		return this
	}

	constructor(value: Type[] = []) {
		assert(isArray(value))
		super(value)
	}
}

export class UnfreezableString
	extends TypicalUnfreezable<string>
	implements IUnfreezableBuffer<string>
{
	protected collection: string

	get() {
		return super.get() as string
	}

	push(...strings: string[]) {
		if (!this.isFrozen) this.collection += strings.join("")
		return this
	}

	write(i: number, char: string) {
		const { collection: currValue } = this
		if (!this.isFrozen)
			this.collection =
				currValue.slice(0, i) + char + currValue.slice(i + 1)
		return this
	}

	constructor(value: string = "") {
		assert(isString(value))
		super(value)
	}
}
