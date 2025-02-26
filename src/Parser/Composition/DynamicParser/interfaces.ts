import type { SignatureIndexSet } from "./interfaces.js"

export interface PreSignature {
	preSignature: SignatureIndexSet
	preSignatureFill: any[]
}

export interface LayerSignature extends PreSignature {
	toApplyOn: SignatureIndexSet
}

export interface StateSignature extends LayerSignature {
	stateIndex: number
}

export type * from "./SignatureIndexSet/interfaces.js"
