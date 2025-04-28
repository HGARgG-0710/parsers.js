import { array, type } from "@hgargg-0710/one"
import assert from "assert"
import type { ICollection } from "src/interfaces/ArrayCollection.js"

const { isArray } = type

export class ArrayCollection<Type = any> implements ICollection<Type> {
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

	init(value: Type[]) {
		this.items = value
		return this
	}

	copy() {
		return new this.constructor(array.copy(this.items))
	}

	get size() {
		return this.items.length
	}

	constructor(protected items: Type[] = []) {
		assert(isArray(items))
	}
}
