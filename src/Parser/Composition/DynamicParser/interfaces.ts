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
}

export type * from "./SignatureIndexSet/interfaces.js"
