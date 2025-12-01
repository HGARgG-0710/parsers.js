import type { ICollection } from "../interfaces.js"
import { BasicArray } from "../internal/BasicArray.js"

/**
 * This class serves as an optimized wrapper for
 * various array operations. It is guaranteed
 * to never free the space taken up by the array
 * and instead retain its size, increasing it
 * whenever necessary.
 *
 * It is best employed as a termporary
 * buffer of a fixed (or mostly fixed) size,
 * for frequent read-write operations.
 *
 * Implements:
 *
 * 1. `ICollection`
 * 2. `IClearable`
 */
export class RetainedArray<T = any>
	extends BasicArray<T>
	implements ICollection<T, readonly T[]>
{
	private ["constructor"]: new (n?: number) => this

	private fakeSize: number = 0

	private get capacity() {
		return super.size
	}

	private freeSpace() {
		return this.capacity - this.fakeSize
	}

	private condAlloc(newItems: number) {
		if (newItems > 0) super.size += newItems
	}

	get size() {
		return this.fakeSize
	}

	copy() {
		const copied = new this.constructor(this.size)
		for (let i = 0; i < this.size; ++i) copied.write(i, this.read(i))
		return copied
	}

	push(x: T): this {
		if (this.freeSpace() > 1) this.write(this.fakeSize++, x)
		else super.push(x)
		return this
	}

	write(i: number, value: T): this {
		if (i > this.fakeSize) this.fakeSize = i + 1
		return super.write(i, value)
	}

	clear() {
		this.fakeSize = 0
	}

	init(newSize: number) {
		this.clear()
		this.condAlloc(newSize - this.size)
		return this
	}

	constructor(allocSize: number = 0) {
		super(new Array(allocSize))
	}
}
