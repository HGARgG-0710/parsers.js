import { array } from "@hgargg-0710/one"
import type { ICollection } from "../interfaces.js"
import { InitMixin } from "../internal/MixinArray.js"

export class ArrayCollection<T = any>
	extends InitMixin<T>
	implements ICollection<T>
{
	private ["constructor"]: new (items?: T[]) => this

	copy() {
		return new this.constructor(array.copy(this.items))
	}

	*[Symbol.iterator]() {
		yield* this.items
	}
}
