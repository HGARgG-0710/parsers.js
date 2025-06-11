import { number } from "@hgargg-0710/one"
import type { IInitializable } from "../interfaces.js"

const { max } = number

/**
 * An optimized stack data-structure
 * that only allocates memory but never releases it.
 */
class RetainedStack<T = any> {
	private readonly stack: T[] = []
	private usedSize: number = 0

	private set maxSize(newMaxSize: number) {
		this.stack.length = newMaxSize
	}

	private get maxSize() {
		return this.stack.length
	}

	private isFull() {
		return this.freeSpace === 0
	}

	private get freeSpace() {
		return this.maxSize - this.usedSize
	}

	isEmpty() {
		return this.usedSize === 0
	}

	pop() {
		return this.stack[this.usedSize--]
	}

	push(item: T) {
		if (this.isFull()) this.stack.push(item)
		else this.stack[this.usedSize] = item
		++this.usedSize
	}

	ensureNew(n: number) {
		this.maxSize += max(0, n - this.freeSpace)
	}
}

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
	TypeArgs extends any[] = any[],
	T extends IInitializable<TypeArgs> = any
> {
	private readonly freeStack = new RetainedStack<T>()

	private allocNew(...x: Partial<TypeArgs> | []) {
		return new this.objectConstructor(...x)
	}

	prealloc(n: number) {
		this.freeStack.ensureNew(n)
		for (let i = 0; i < n; ++i) this.freeStack.push(this.allocNew())
	}

	create(...x: [] | Partial<TypeArgs>) {
		return this.freeStack.isEmpty()
			? this.allocNew(...x)
			: this.freeStack.pop().init(...x)
	}

	free(item: T) {
		this.freeStack.push(item)
	}

	constructor(
		private readonly objectConstructor: new (
			...x: Partial<TypeArgs> | []
		) => T
	) {}
}
