import { object, type } from "@hgargg-0710/one"
import assert from "assert"
import type { IPlainMap } from "../../interfaces/PlainMap.js"

const { isStruct } = type
const { copy } = object

/**
 * It is a thin `object` wrapper implementing `IPlainMap<string, T>`
 */
export class PlainObject<T = any> implements IPlainMap<string, T> {
	private ["constructor"]: new (object?: object) => this

	annul(key: string) {
		this.object[key] = undefined
	}

	read(key: string): T | undefined {
		return this.object[key]
	}

	write(key: string, value: T) {
		this.object[key] = value
	}

	copy() {
		return new this.constructor(copy(this.object))
	}

	values(): IteratorObject<T | undefined> {
		return Object.values(this.object).values()
	}

	constructor(private readonly object: object = {}) {
		assert(isStruct(object))
	}
}
