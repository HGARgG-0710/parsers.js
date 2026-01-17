import { array, type } from "@hgargg-0710/one"
import assert from "assert"
import type { ICollection } from "../interfaces.js"

const { isArray } = type

// ! PRE-DOC: 1. *not* intended for complex extension (ok if only to add new wrapper-methods);
// 				2. TIGHTLY COUPLED to 'items' being a DIRECT representation of 'this.size'
// 					[i.e., internally, THEY CANNOT DIFFER without violating LSP!]
/**
 * A thin wrapper around `T[]`, satisfying the `ICollection<T, readonly T[]\>` interface.
 */
export class ArrayCollection<T = any> implements ICollection<T, readonly T[]> {
	private ["constructor"]: new (items?: T[]) => this

	protected set size(newSize: number) {
		this.items.length = newSize
	}

	get size() {
		return this.items.length
	}

	write(i: number, value: T) {
		assert(i < this.size)
		this.items[i] = value
		return this
	}

	push(x: T) {
		this.items.push(x)
		return this
	}

	read(i: number) {
		assert(i >= 0)
		return this.items[i]
	}

	find(item: T) {
		return this.items.findIndex((x) => x === item)
	}

	has(item: T) {
		return this.find(item) > -1
	}

	get() {
		return this.items as readonly T[]
	}

	*[Symbol.iterator]() {
		yield* this.items
	}

	last(i: number = 0) {
		const index = this.size - 1 - i
		return this.read(index)
	}

	filter(pred: (x: T, i: number, target: this) => boolean) {
		return this.items.filter((x, i) => pred(x, i, this))
	}

	isEmpty() {
		return this.size === 0
	}

	init(items: T[]) {
		this.items = items
		return this
	}

	resize(size: number) {
		this.clear()
		this.size = size
		return this
	}

	clear() {
		array.clear(this.items)
		return this
	}

	copy() {
		return new this.constructor(array.copy(this.items))
	}

	pop() {
		return this.items.pop()
	}

	unshift(item: T) {
		this.items.unshift(item)
		return this
	}

	constructor(private items: T[] = []) {
		assert(isArray(items))
	}
}
