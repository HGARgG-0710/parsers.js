import type { Summat } from "@hgargg-0710/summat.ts"
import type { SignatureIndexSet } from "./classes.js"

export interface IPreSignature {
	preSignature: SignatureIndexSet
	preSignatureFill: any[]
}

export interface ILayerSignature extends IPreSignature {
	toApplyOn: SignatureIndexSet
}

export interface IStateSignature extends ILayerSignature {
	stateIndex: number
	stateTransform?: (x: Summat) => Summat
}
