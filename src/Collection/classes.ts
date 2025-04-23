import { array } from "@hgargg-0710/one"
import { IterableCollection } from "src/internal/Collection/IterableCollection.js"
import type { ICollection } from "./interfaces.js"

export class ArrayCollection<Type = any>
	extends IterableCollection<Type>
	implements ICollection<Type>
{
	protected value: Type[];

	["constructor"]: new (...x: any[]) => ArrayCollection<Type>

	get() {
		return super.get() as readonly Type[]
	}

	push(...x: Type[]) {
		this.value.push(...x)
		return this
	}

	init(value: Type[]) {
		this.value = value
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
