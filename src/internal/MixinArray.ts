import assert from "assert"
import { array, type } from "@hgargg-0710/one"
import type { ICollection } from "../interfaces.js"

const { isArray } = type

export class MixinArray<Type = any> implements ICollection<Type> {
	["constructor"]: new (...x: any[]) => this

	get() {
		return this.items as readonly Type[]
	}

	write(i: number, value: Type) {
		this.items[i] = value
		return this
	}

	push(...x: Type[]) {
		this.items.push(...x)
		return this
	}

	read(i: number) {
		return this.items[i]
	}

	copy() {
		return new this.constructor(array.copy(this.items))
	}

	get size() {
		return this.items.length
	}

	*[Symbol.iterator]() {
		yield* this.items
	}

	constructor(protected items: Type[] = []) {
		assert(isArray(items))
	}
}
