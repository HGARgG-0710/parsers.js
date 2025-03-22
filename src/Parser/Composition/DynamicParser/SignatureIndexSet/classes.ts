import type { ISignatureIndexSet } from "./interfaces.js"

import { array, functional, boolean } from "@hgargg-0710/one"
const { sort, numbers } = array
const { negate, has } = functional
const { eqcurry } = boolean

export class SignatureIndexSet implements ISignatureIndexSet {
	protected readonly indexes: number[]
	protected readonly indexSet: Set<number>;

	["constructor"]: new (arity: number, indexes: number[]) => SignatureIndexSet

	keepOut(x: number): ISignatureIndexSet {
		return new SignatureIndexSet(
			this.arity,
			this.indexes.filter(negate(eqcurry(x)))
		)
	}

	complement(): ISignatureIndexSet {
		return new SignatureIndexSet(
			this.arity,
			numbers(this.arity).filter(negate(has(this.indexSet)))
		)
	}

	*[Symbol.iterator]() {
		yield* this.indexes
	}

	subtract(x: ISignatureIndexSet): ISignatureIndexSet {
		return new SignatureIndexSet(
			this.arity,
			this.indexes.filter(negate(has(new Set(x))))
		)
	}

	has(x: number): boolean {
		return this.indexSet.has(x)
	}

	copy() {
		return new this.constructor(this.arity, this.indexes)
	}

	constructor(public readonly arity: number, indexes: number[]) {
		this.indexes = sort(
			Array.from(
				(this.indexSet = new Set(indexes.filter((x) => x < arity)))
			)
		)
	}
}
