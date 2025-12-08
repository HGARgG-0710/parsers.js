import { type } from "@hgargg-0710/one"
import assert from "assert"

const { isArray } = type

/**
 * Common simple `Array`-wrapper.
 * Does not contain an `init` method [type-level encapsulation is in place].
 */
export abstract class BasicArray<T = any> {
	write(i: number, value: T) {
		this.items[i] = value
		return this
	}

	push(...x: T[]) {
		this.items.push(...x)
		return this
	}

	read(i: number) {
		return this.items[i]
	}

	protected set size(newSize: number) {
		this.items.length = newSize
	}

	get size() {
		return this.items.length
	}

	find(item: T) {
		for (let i = 0; i < this.size; ++i) if (this.read(i) === item) return i
		return -1
	}

	has(item: T) {
		return this.find(item) > -1
	}

	get() {
		return this.items as readonly T[]
	}

	*[Symbol.iterator]() {
		for (let i = 0; i < this.size; ++i) yield this.read(i)
	}

	constructor(protected items: T[] = []) {
		assert(isArray(items))
	}
}
