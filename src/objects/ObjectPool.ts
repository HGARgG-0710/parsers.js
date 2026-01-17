import { Config } from "../global.js"
import type { IInitializable } from "../interfaces.js"
import { ArrayCollection } from "./ArrayCollection.js"

// TODO: REFACTOR THIS using the STATE PATTERN [depending on the 'Config.features.usePools']
/**
 * A class for creation of pool objects for a given type `T`.
 * To be used correctly, it requires that:
 *
 * 1. type `T` in question be `IInitializable<TypeArgs>`
 * 2. that constructor for the type `T` given have all of its `...args: Partial<TypeArgs> | []` optional
 * 3. that the objects of type `T` from the given constructor be (guaranteedly) re-usable,
 * that is, it is possible to re-initialize the given object without the possibility of it
 * being usable in a way that can be considered "incorrect". That is to say, it is entirely
 * up to the user to ensure that each new `.init(...)` method allows one to treat an existing object
 * as if it is one that is being created anew. This condition, in particular, is crucial for
 * performance (since it enables pooling via `ObjectPool`), and correctness (since it
 * prevents erronous usage).
 * 4. that all the `.free(object: T): void` calls are made on objects that are NO LONGER in use
 * (that is to say - there are no more active references on them)
 */
export class ObjectPool<
	T extends IInitializable<TypeArgs> = any,
	TypeArgs extends any[] = any[]
> {
	private readonly freeStack = new ArrayCollection<T>()

	static clear(...pools: ObjectPool[]) {
		for (const pool of pools) pool.clear()
	}

	private get isActive() {
		return Config.features.usePools
	}

	private canReuse() {
		return this.isActive && !this.freeStack.isEmpty()
	}

	private reuseOld(...withArgs: [] | Partial<TypeArgs>) {
		return this.freeStack.pop()!.init(...withArgs)
	}

	private allocNew(...x: Partial<TypeArgs> | []) {
		return new this.objectConstructor(...x)
	}

	create(...args: [] | Partial<TypeArgs>) {
		return this.canReuse() ? this.reuseOld(...args) : this.allocNew(...args)
	}

	free(item: T) {
		if (this.isActive) this.freeStack.push(item)
	}

	clear() {
		this.freeStack.clear()
	}

	constructor(
		private readonly objectConstructor: new (
			...x: Partial<TypeArgs> | []
		) => T
	) {}
}
