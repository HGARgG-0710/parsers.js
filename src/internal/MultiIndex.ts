import { array, type } from "@hgargg-0710/one"
import assert from "assert"

const { isArray } = type
const { last, copy, clear } = array

/**
 * This class represents a multi-index position
 * inside a tree. It is employed by the library's
 * Tree-Iteration algorithms to track the progress
 * across the tree and find the next node to be
 * visited.
 *
 * It can also be employed to quickly navigate
 * across `DepthStream` via the `.navigate(multind: MultiIndesx)`
 * method.
 */
export class MultiIndex {
	private ["constructor"]: new (index: number[]) => this

	private index: number[]

	private set levels(length: number) {
		this.index.length = length
	}

	private fillZerosUntil(length: number) {
		for (let i = this.levels; i < length; ++i) this.index.push(0)
	}

	get levels() {
		return this.index.length
	}

	get last(): number | undefined {
		return last(this.index)
	}

	get(): readonly number[] {
		return this.index
	}

	slice(from: number = 0, to: number = this.levels) {
		return this.index.slice(from, to < 0 ? this.levels + to : to)
	}

	copy() {
		return new this.constructor(copy(this.index))
	}

	nextLevel() {
		this.extend([0])
	}

	prevLevel() {
		this.index.pop()
	}

	resize(length: number = 0) {
		if (length <= this.levels) this.levels = length
		else this.fillZerosUntil(length)
		return this
	}

	clear() {
		clear(this.index)
		return this
	}

	incLast() {
		++this.index[this.levels - 1]
	}

	decLast() {
		--this.index[this.levels - 1]
	}

	extend(subIndex: number[]) {
		this.index.push(...subIndex)
	}

	from(index: number[]) {
		assert(isArray(index))
		this.index = copy(index)
		return this
	}

	constructor(index: number[] = []) {
		this.from(index)
	}
}
