import { array } from "@hgargg-0710/one"
import { InitMixin } from "../internal/MixinArray.js"
import type { ICollection } from "../interfaces.js"

export class ArrayCollection<Type = any>
	extends InitMixin<Type>
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
