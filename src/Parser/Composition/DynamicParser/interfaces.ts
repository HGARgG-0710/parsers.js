import type { Summat } from "@hgargg-0710/summat.ts"
import type { ISignatureIndexSet } from "./interfaces.js"

export interface IPreSignature {
	preSignature: ISignatureIndexSet
	preSignatureFill: any[]
}

export interface ILayerSignature extends IPreSignature {
	toApplyOn: ISignatureIndexSet
}

export interface IStateSignature extends ILayerSignature {
	stateIndex: number
	stateTransform?: (x: Summat) => Summat
}

export type * from "./SignatureIndexSet/interfaces.js"
