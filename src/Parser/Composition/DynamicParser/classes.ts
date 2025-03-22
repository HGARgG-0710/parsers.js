import type { Summat } from "@hgargg-0710/summat.ts"

import type {
	IPreSignature,
	ILayerSignature,
	IStateSignature,
	ISignatureIndexSet
} from "./interfaces.js"

import { applySignature } from "./utils.js"

import { array } from "@hgargg-0710/one"
import { Composition } from "../classes.js"

export const PreSignature = (
	preSignature: ISignatureIndexSet,
	preSignatureFill: any[]
): IPreSignature => ({
	preSignature,
	preSignatureFill
})

export const LayerSignature = (
	signature: IPreSignature,
	toApplyOn: ISignatureIndexSet
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

export * from "./SignatureIndexSet/classes.js"
