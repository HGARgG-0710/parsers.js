import type { ICopiable } from "../interfaces.js"

import { array, functional, boolean } from "@hgargg-0710/one"
const { sort, numbers } = array
const { negate, has } = functional
const { eqcurry } = boolean

export class IndexSet implements ICopiable, Iterable<number> {
	protected readonly asArray: number[]
	protected readonly asSet: Set<number>;

	["constructor"]: new (arity: number, indexes: number[]) => IndexSet

	keepOut(x: number) {
		return new IndexSet(
			this.length,
			this.asArray.filter(negate(eqcurry(x)))
		)
	}

	complement() {
		return new IndexSet(
			this.length,
			numbers(this.length).filter(negate(has(this.asSet)))
		)
	}

	*[Symbol.iterator]() {
		yield* this.asArray
	}

	subtract(x: IndexSet) {
		return new IndexSet(
			this.length,
			this.asArray.filter(negate(has(new Set(x))))
		)
	}

	has(x: number): boolean {
		return this.asSet.has(x)
	}

	copy() {
		return new this.constructor(this.length, this.asArray)
	}

	constructor(public readonly length: number, indexes: number[]) {
		this.asArray = sort(
			Array.from(
				(this.asSet = new Set(indexes.filter((x) => x < length)))
			)
		)
	}
}
