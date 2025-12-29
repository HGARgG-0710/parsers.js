import { array } from "@hgargg-0710/one"
import type { ICollection } from "../interfaces.js"
import { BasicArray } from "../internal/BasicArray.js"

/**
 * A thin wrapper around `T[]`, satisfying the `ICollection<T, readonly T[]\>` interface.
 */
export class ArrayCollection<T = any>
	extends BasicArray<T>
	implements ICollection<T, readonly T[]>
{
	private override ["constructor"]: new (items?: T[]) => this

	init(items: T[]) {
		this.items = items
		return this
	}

	clear() {
		array.clear(this.items)
	}

	copy() {
		return new this.constructor(array.copy(this.items))
	}
}
