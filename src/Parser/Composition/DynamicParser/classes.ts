import type { Summat } from "@hgargg-0710/summat.ts"
import type { ICopiable } from "../../../interfaces.js"

import type {
	IPreSignature,
	ILayerSignature,
	IStateSignature
} from "./interfaces.js"

import { applySignature } from "./utils.js"

import { Composition } from "../classes.js"

import { array, functional, boolean } from "@hgargg-0710/one"
const { sort, numbers } = array
const { negate, has } = functional
const { eqcurry } = boolean

export const PreSignature = (
	preSignature: SignatureIndexSet,
	preSignatureFill: any[]
): IPreSignature => ({
	preSignature,
	preSignatureFill
})

export const LayerSignature = (
	signature: IPreSignature,
	toApplyOn: SignatureIndexSet
): ILayerSignature => ({
	...signature,
	toApplyOn
})

export const StateSignature = (
	signature: ILayerSignature,
	stateIndex: number,
	stateTransform: (x: Summat) => Summat
): IStateSignature => ({
	...signature,
	stateIndex,
	stateTransform
})

export class SignatureIndexSet implements ICopiable {
	protected readonly indexes: number[]
	protected readonly indexSet: Set<number>;

	["constructor"]: new (arity: number, indexes: number[]) => SignatureIndexSet

	keepOut(x: number) {
		return new SignatureIndexSet(
			this.arity,
			this.indexes.filter(negate(eqcurry(x)))
		)
	}

	complement() {
		return new SignatureIndexSet(
			this.arity,
			numbers(this.arity).filter(negate(has(this.indexSet)))
		)
	}

	*[Symbol.iterator]() {
		yield* this.indexes
	}

	subtract(x: SignatureIndexSet) {
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

// * important pre-doc note: *THE* Holy Grail of this library [to which StreamParser is second], towards which ALL has been building - The Lord Self-Modifying Parser Cometh!
// ! important things to keep in mind [for future docs]:
// * 1. Signatures for given 'Function's [except for last one] used have form: f(value [0], ... [preFilledSignature], state [stateIndex], ... [preFilledSignature])
// * 2. The LAST "entry" function can have ANY 'preFilledSignature'
export class DynamicParser<
	ArgType extends any[] = any[],
	OutType = any
> extends Composition<ArgType, OutType> {
	state: Summat = { parser: this }

	init(signatures: IStateSignature[]) {
		let layers = array.copy(this.layers)
		for (const signature of signatures)
			applySignature(layers, signature, this.state)
		this.layers = layers
	}

	constructor(layers: Function[] = [], signatures: IStateSignature[] = []) {
		super(layers)
		this.init(signatures)
	}
}
