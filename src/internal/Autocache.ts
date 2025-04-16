import type { IIndexable, ISettable } from "../interfaces.js"
import { Callable } from "./Callable.js"

export class Autocache<KeyType = any, ValueType = any> extends Callable {
	protected __call__(x: KeyType) {
		const cached = this.value.index(x)
		if (!cached) {
			const newlyCached = this.callback(x)
			this.value.set(x, newlyCached)
			return newlyCached
		}
		return cached
	}

	constructor(
		readonly value: ISettable<KeyType, ValueType> &
			IIndexable<ValueType | undefined>,
		protected callback: (x: KeyType) => ValueType
	) {
		super()
	}
}
