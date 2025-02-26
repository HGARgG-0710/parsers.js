import type { Summat } from "@hgargg-0710/summat.ts"

import type {
	PreSignature as IPreSignature,
	LayerSignature as ILayerSignature,
	StateSignature as IStateSignature,
	SignatureIndexSet
} from "./interfaces.js"

import type { Composition as IComposition } from "../interfaces.js"

import { Callable } from "../abstract.js"

import * as flow from "@hgargg-0710/flow"
const { prop: propSet } = flow.object

import * as one from "@hgargg-0710/one"
const { functional, array, inplace, object } = one
const { argFiller, id } = functional
const { substitute } = array
const { mutate } = inplace

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
	stateIndex: number
): IStateSignature => ({
	...signature,
	stateIndex
})

// * important pre-doc note: *THE* Holy Grail of this library [to which StreamParser is second], towards which ALL has been building - The Lord Self-Modifying Parser Cometh!
// ! important things to keep in mind [for future docs]:
// * 1. Signatures for given 'Function's [except for last one] used have form: f(value [0], ... [preFilledSignature], state [stateIndex], ... [preFilledSignature])
// * 2. The LAST "entry" function can have ANY 'preFilledSignature'
export class DynamicParser extends Callable {
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
		const preLayers = array.copy(this.layers)

		for (const signature of signatures) {
			const { preSignature, preSignatureFill, toApplyOn, stateIndex } = signature
			const { arity } = preSignature
			const preFill = preSignature.keepOut(stateIndex)
			const preFillComplement = Array.from(preFill.complement())

			const substitutor = substitute(arity, Array.from(preFill))(preSignatureFill)
			const accessSet = new Set(toApplyOn)

			mutate(preLayers, (layer: Function, i: number) =>
				accessSet.has(i)
					? argFiller(layer)(
							...propSet(
								substitutor(array.copy(preFillComplement)),
								stateIndex,
								this.stateTransform(object.copy(this.state))
							)
					  )(...preSignatureFill)
					: layer
			)
		}

		this.layers = preLayers
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
