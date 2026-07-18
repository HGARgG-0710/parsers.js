import assert from "assert"
import { Config, Pools } from "../global.js"
import { BadId, IncrementId } from "../global/constants.js"
import type { IInitializable, IPoolable } from "../interfaces.js"
import { ArrayCollection } from "./ArrayCollection.js"

// ! PRE-DOC [important]: the handling of the correctness of `poolId` is
// 	on the user ENTIRELY. Meaning, that the library *does not* provide a
// 	`setPoolId` method, since the "one pool per class" is (objectively)
// 	the best (simplest, least error-prone) way to deal with this.
//
// 	If the user needs to - nobody's stopping them from doing a
// 	`override get pool() { return this._pool }`, with a
// 	`setPool(newPool): void` setter method for `this._pool`.
//
// 	Then, this hypothetical `setPool` would be called inside the constructor,
// 	since it is IMMUTABLE after first write,
//
// 	However, it is still advised STRONGLY to use the "one pool per class"
// 	whenever possible and reasonable. Note that pools DO support the
// 	'worker-threads'-style multithreading by default, since workers are
// 	completely isolated in memory.
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
	T extends IPoolable<Args> = any,
	Args extends any[] = any[]
> {
	readonly id: number

	private static TotalInstances = BadId

	private static NewId() {
		return (this.TotalInstances = IncrementId(this.TotalInstances))
	}

	private readonly active: ObjectPoolActive<T, Args>
	private readonly inactive: ObjectPoolInactive<T, Args>

	static clear(...pools: ObjectPool[]) {
		for (const pool of pools) pool.clear()
	}

	private ensureOwns(item: T) {
		assert.strictEqual(item.poolId, this.id)
	}

	private getState() {
		return Config.objectPools.enable ? this.active : this.inactive
	}

	get size() {
		return this.getState().size
	}

	// ! PRE-DOC: the user-constructor is ITSELF responsible for
	// 		MAKING SURE that the ownership relationship IS PRESERVED
	// 		[i.e. that the created/reused objects have the correct poolId].
	create(...args: [] | Partial<Args>) {
		const newlyCreated = this.getState().create(...args)
		this.ensureOwns(newlyCreated)
		return newlyCreated
	}

	free(item: T) {
		this.ensureOwns(item)
		this.getState().free(item)
	}

	clear() {
		this.getState().clear()
	}

	constructor(
		objectConstructor: new (...x: Partial<Args> | []) => T,
		limitSize = Config.objectPools.defaultMaxSize
	) {
		Pools.All.add(this)
		this.active = new ObjectPoolActive(objectConstructor, limitSize)
		this.inactive = new ObjectPoolInactive(objectConstructor)
		this.id = ObjectPool.NewId()
	}
}

interface IObjectPoolState<
	T extends IInitializable<Args> = any,
	Args extends any[] = []
> {
	get size(): number
	clear(): void
	create(...args: Partial<Args> | []): T
	free(item: T): void
}

class ObjectPoolActive<
	T extends IPoolable<Args>,
	Args extends any[] = []
> implements IObjectPoolState<T, Args> {
	private readonly freeStack = new ArrayCollection<T>()

	private canReuse() {
		return !this.freeStack.isEmpty()
	}

	private reuseOld(...withArgs: [] | Partial<Args>) {
		const item = this.freeStack.pop()!
		assert(!item.isUsed)
		item.markUsed()
		item.init(...withArgs)
		return item
	}

	private allocNew(...x: Partial<Args> | []) {
		return new this.objectConstructor(...x)
	}

	get size() {
		return this.freeStack.size
	}

	create(...args: [] | Partial<Args>) {
		return this.canReuse()
			? this.reuseOld(...args)
			: this.allocNew(...args)
	}

	free(item: T) {
		assert(this.size < this.limitSize)
		assert(item.isUsed)
		item.markFree()
		this.freeStack.push(item)
		item.postFree()
	}

	clear() {
		this.freeStack.clear()
	}

	constructor(
		private readonly objectConstructor: new (
			...x: Partial<Args> | []
		) => T,
		private readonly limitSize: number
	) {}
}

class ObjectPoolInactive<
	T extends IInitializable<Args>,
	Args extends any[] = []
> implements IObjectPoolState<T, Args> {
	get size() {
		return 0
	}

	clear() {}

	create(...args: [] | Partial<Args>): T {
		return new this.objectConstructor(...args)
	}

	free(_item: T): void {}

	constructor(
		private readonly objectConstructor: new (
			...args: Partial<Args> | []
		) => T
	) {}
}
