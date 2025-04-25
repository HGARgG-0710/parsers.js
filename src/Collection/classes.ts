import { array, type } from "@hgargg-0710/one"
import assert from "assert"
import type { ICollection } from "./interfaces.js"

const { isArray } = type

export class ArrayCollection<Type = any> implements ICollection<Type> {
	["constructor"]: new (...x: any[]) => ArrayCollection<Type>

	get() {
		return this.collection as readonly Type[]
	}

	push(...x: Type[]) {
		this.collection.push(...x)
		return this
	}

	init(value: Type[]) {
		this.collection = value
		return this
	}

	copy() {
		return new this.constructor(array.copy(this.collection))
	}

	get size() {
		return this.collection!.length
	}

	constructor(protected collection: Type[] = []) {
		assert(isArray(collection))
	}
}

export * as Sequence from "./Sequence/classes.js"
