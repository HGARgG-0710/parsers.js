import type { ICollection } from "./interfaces.js"
import { IterableCollection } from "src/internal/Collection.js";

import { array } from "@hgargg-0710/one"

export class ArrayCollection<Type = any>
	extends IterableCollection<Type>
	implements ICollection<Type>
{
	protected value: Type[];

	["constructor"]: new (value?: Type[]) => ArrayCollection<Type>

	get() {
		return super.get() as readonly Type[]
	}

	push(...x: Type[]) {
		this.value.push(...x)
		return this
	}

	copy() {
		return new this.constructor(array.copy(this.value))
	}

	constructor(value: Type[] = []) {
		super(value)
	}
}

export * as Buffer from "./Buffer/classes.js"
