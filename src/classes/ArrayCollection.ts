import { array } from "@hgargg-0710/one"
import type { ICollection } from "../interfaces.js"
import { MixinArray } from "../internal/MixinArray.js"

/**
 * A thin wrapper around `T[]`, satisfying the `ICollection<T, readonly T[]\>` interface.
 */
export class ArrayCollection<T = any>
	extends MixinArray<T>
	implements ICollection<T, readonly T[]>
{
	private ["constructor"]: new (items?: T[]) => this

	init(items: T[]) {
		this.items = items
		return this
	}

	copy() {
		return new this.constructor(array.copy(this.items))
	}

	*[Symbol.iterator]() {
		yield* this.items
	}
}
