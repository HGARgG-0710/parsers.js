import assert from "assert"
import type { IIndexable, ISettable } from "../interfaces.js"
import { Callable } from "./Callable.js"
import { type } from "@hgargg-0710/one"

const { isFunction } = type

export class Autocache<KeyType = any, ValueType = any> extends Callable {
	protected __call__(x: KeyType) {
		const cached = this.cache.index(x)
		if (!cached) {
			const newlyCached = this.callback(x)
			this.cache.set(x, newlyCached)
			return newlyCached
		}
		return cached
	}

	constructor(
		private readonly cache: ISettable<KeyType, ValueType> &
			IIndexable<ValueType | undefined>,
		private callback: (x: KeyType) => ValueType
	) {
		assert(isFunction(callback))
		super()
	}
}
