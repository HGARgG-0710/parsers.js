import { array, type } from "@hgargg-0710/one"
import assert from "assert"
import type { IPersistentAccumulator } from "../interfaces.js"

const { isArray } = type

export class OutputBuffer<Type = any> implements IPersistentAccumulator<Type> {
	private ["constructor"]: new (collection?: Type[]) => this

	private _isFrozen: boolean = false

	private set isFrozen(newIsFrozen: boolean) {
		this._isFrozen = newIsFrozen
	}

	get isFrozen() {
		return this._isFrozen
	}

	push(...elements: Type[]) {
		if (!this.isFrozen) this.collection.push(...elements)
		return this
	}

	get() {
		return this.collection as readonly Type[]
	}

	copy() {
		return new this.constructor(array.copy(this.collection))
	}

	read(i: number) {
		return this.collection![i] as Type
	}

	unfreeze() {
		this.isFrozen = false
		return this
	}

	freeze() {
		this.isFrozen = true
		return this
	}

	get size() {
		return this.collection!.length
	}

	constructor(private readonly collection: Type[] = []) {
		assert(isArray(collection))
	}
}
