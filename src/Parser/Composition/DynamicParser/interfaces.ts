import type { Summat } from "@hgargg-0710/summat.ts"
import type { IndexSet } from "./classes.js"

export interface IPreSignature {
	preSignature: IndexSet
	preSignatureFill: any[]
}

export interface ILayerSignature extends IPreSignature {
	toApplyOn: IndexSet
}

export interface IStateSignature extends ILayerSignature {
	stateIndex: number
	stateTransform?: (x: Summat) => Summat
}
