import type { IStateSignature } from "./interfaces.js"

import * as flow from "@hgargg-0710/flow"
const { prop: propSet } = flow.object

import * as one from "@hgargg-0710/one"
const { functional, array, inplace, object } = one
const { argFiller } = functional
const { substitute } = array
const { mutate } = inplace

export function applySignatures(layers: Function[], signatures: IStateSignature[]) {
	for (const signature of signatures) {
		const { preSignature, preSignatureFill, toApplyOn, stateIndex } = signature
		const { arity } = preSignature

		const accessSet = new Set(toApplyOn)
		const preFill = preSignature.keepOut(stateIndex)
		const preFillComplement = Array.from(preFill.complement())

		const substitutor = substitute(arity, Array.from(preFill))(preSignatureFill)

		mutate(layers, (layer: Function, i: number) =>
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
	return layers
}
