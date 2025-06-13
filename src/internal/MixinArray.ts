import { type } from "@hgargg-0710/one"
import assert from "assert"

const { isArray } = type

/**
 * Common simple `Array`-wrapper.
 * Does not contain an `init` method [type-level encapsulation is in place].
 */
export class MixinArray<T = any> {
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

/**
 * An extension of `MixinArray` with `.init`.
 * (Does not respect encapsulation)
*/
export class InitMixin<T = any> extends MixinArray<T> {
	init(items: T[]) {
		this.items = items
		return this
	}
}
