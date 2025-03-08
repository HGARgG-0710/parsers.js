import type { Summat } from "@hgargg-0710/summat.ts"

import type { IComposition } from "../interfaces.js"
import type {
	IPreSignature,
	ILayerSignature,
	IStateSignature,
	ISignatureIndexSet
} from "./interfaces.js"

import { applySignatures } from "./utils.js"

import { Callable } from "../abstract.js"

import { functional, array } from "@hgargg-0710/one"
const { id } = functional

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
	stateIndex: number
): IStateSignature => ({
	...signature,
	stateIndex
})

// * important pre-doc note: *THE* Holy Grail of this library [to which StreamParser is second], towards which ALL has been building - The Lord Self-Modifying Parser Cometh!
// ! important things to keep in mind [for future docs]:
// * 1. Signatures for given 'Function's [except for last one] used have form: f(value [0], ... [preFilledSignature], state [stateIndex], ... [preFilledSignature])
// * 2. The LAST "entry" function can have ANY 'preFilledSignature'
export class DynamicParser extends Callable implements IComposition {
	state: Summat = { parser: this }

	set layers(layers: Function[]) {
		this.composition.layers = layers
	}

	get layers() {
		return this.composition.layers
	}

	protected __call__(...x: any[]) {
		return this.composition(...x)
	}

	init(signatures: IStateSignature[]) {
		this.layers = applySignatures(array.copy(this.layers), signatures)
	}

	constructor(
		protected composition: IComposition,
		public stateTransform: (state: Summat) => Summat = id,
		signatures: IStateSignature[] = []
	) {
		super()
		this.init(signatures)
	}
}

export * from "./SignatureIndexSet/classes.js"
