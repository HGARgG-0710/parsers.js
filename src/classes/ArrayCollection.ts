import { array } from "@hgargg-0710/one"
import { InitializableMixin } from "../internal/MixinArray.js"
import type { ICollection } from "../interfaces.js"

export class ArrayCollection<Type = any>
	extends InitializableMixin<Type>
	implements ICollection<Type>
{
	private ["constructor"]: new (items?: Type[]) => this

	copy() {
		return new this.constructor(array.copy(this.items))
	}

	*[Symbol.iterator]() {
		yield* this.items
	}
}
