import { array, type } from "@hgargg-0710/one"
import assert from "assert"

const { isArray } = type
const { last, first, copy, clear } = array

export class MultiIndex {
	private set levels(length: number) {
		this.index.length = length
	}

	get levels() {
		return this.index.length
	}

	get(): readonly number[] {
		return this.index
	}

	first() {
		return first(this.index)
	}

	last() {
		return last(this.index)
	}

	slice(from: number = 0, to: number = this.levels) {
		return this.index.slice(from, to < 0 ? this.levels + to : to)
	}

	copy() {
		return new MultiIndex(copy(this.index))
	}

	nextLevel() {
		this.extend([0])
	}

	prevLevel() {
		return this.index.pop()
	}

	resize(length: number = 0) {
		this.levels = length
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

	from(multind: MultiIndex) {
		this.index = copy(multind.index)
		return this
	}

	constructor(private index: number[] = []) {
		assert(isArray(index))
	}
}
