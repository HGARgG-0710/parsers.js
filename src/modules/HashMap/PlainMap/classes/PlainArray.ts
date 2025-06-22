import { array, type } from "@hgargg-0710/one"
import assert from "assert"
import type { IPlainMap } from "../../interfaces/PlainMap.js"

const { isArray } = type
const { copy } = array

/**
 * A bare `array` wrapper implementing `IPlainMap<number, T>`
 */
export class PlainArray<T = any> implements IPlainMap<number, T> {
	private ["constructor"]: new (array?: (T | undefined)[]) => this

	annul(i: number) {
		this.array[i] = undefined
	}

	read(i: number): T | undefined {
		return this.array[i]
	}

	write(i: number, value: T) {
		this.array[i] = value
	}

	copy() {
		return new this.constructor(copy(this.array))
	}

	values(): IteratorObject<T | undefined> {
		return this.array.values()
	}

	constructor(private readonly array: (T | undefined)[] = []) {
		assert(isArray(array))
	}
}
