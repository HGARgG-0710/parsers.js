import type { Collection } from "./interfaces.js"
import { IterableCollection } from "./abstract.js"

export class ArrayCollection<Type = any>
	extends IterableCollection<Type>
	implements Collection<Type>
{
	protected value: Type[]

	get() {
		return super.get() as readonly Type[]
	}

	push(...x: Type[]) {
		this.value.push(...x)
		return this
	}

	constructor(value: Type[] = []) {
		super(value)
	}
}

export * as Buffer from "./Buffer/classes.js"
