import type { Summat } from "@hgargg-0710/summat.ts"
import type { IStateSignature } from "./interfaces.js"

import * as flow from "@hgargg-0710/flow"
const { prop: propSet } = flow.object

import * as one from "@hgargg-0710/one"
const { functional, array, inplace, object } = one
const { argFiller, id } = functional
const { substitute } = array
const { mutate } = inplace

/**
 * [note: originally intended as a detail of `DynamicParser.init`]
 *
 * Applies the signature (note: mutating) to the `layers`
 * array of transformations, using the provided `IStateSignatures` in the following fashion:
 *
 * 1. `.toApplyOn` property defines the indexes in `layers` to be affected by the transformations
 * 2. `.stateIndex` reserves the index for `.state` object of the passed `state`, to which `stateTransform` is applied (non-mutating)
 * 3. `.preSignature.keepOut(stateIndex)` is used to define the indexes automatically pre-filled by `.preSignatureFill`
 * 4. makes remaining indexes the input positions (parameters) of the resulting functions
 */
export function applySignature(
	layers: Function[],
	signature: IStateSignature,
	state: Summat
) {
	const {
		preSignature,
		preSignatureFill,
		toApplyOn,
		stateIndex,
		stateTransform
	} = signature

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
						(state = (stateTransform || id)(object.copy(state)))
					)
			  )(...preSignatureFill)
			: layer
	)

	return layers
}
