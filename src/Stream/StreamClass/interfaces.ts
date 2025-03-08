import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../interfaces.js"
import type { Prevable, Started } from "../ReversibleStream/interfaces.js"
import type { Initializable } from "./methods/init.js"
import type { Position } from "../../Position/interfaces.js"

// * Optional Property-interfaces

export interface Stateful {
	state: Summat
}

// * Default Methods (single signature)

export interface Finishable<Type = any> {
	finish: () => Type
}

export interface Navigable<Type = any> {
	navigate: (position: Position) => Type
}

export interface Rewindable<Type = any> {
	rewind: () => Type
}

export interface Updatable<Type = any> {
	update?: () => Type
}

// * Mandatory Property-interfaces

export interface IsEndCurrable {
	isCurrEnd: () => boolean
}

export interface IsStartCurrable {
	isCurrStart: () => boolean
}

export interface EndableStream<Type = any> extends BasicStream<Type>, IsEndCurrable {}

interface PrimalStreamClassSignature<Type = any> extends IsEndCurrable {
	initGetter?: () => Type
	baseNextIter: () => Type
	defaultIsEnd: () => boolean
	currGetter?: () => Type
}

interface StreamClassTransferable<Type = any>
	extends PrimalStreamClassSignature<Type>,
		Partial<Pick<ReversedStreamClassInstance<Type>, "prev">>,
		Partial<Pick<ReversedStreamClassInstance<Type>, "basePrevIter">>,
		Partial<IsStartCurrable> {}

interface BasicStreamClassInstance<Type = any>
	extends BasicStream<Type>,
		Initializable,
		PrimalStreamClassSignature<Type>,
		Started,
		Navigable<Type>,
		Finishable<Type>,
		Iterable<Type> {}

export interface StreamClassSignature<Type = any> extends StreamClassTransferable<Type> {
	buffer?: boolean
	state?: boolean
	hasPosition?: boolean
	isPattern?: boolean
}

export interface StreamClassInstance<Type = any>
	extends BasicStreamClassInstance<Type>,
		StreamClassTransferable<Type>,
		Partial<Prevable<Type>>,
		Partial<IsStartCurrable>,
		Partial<Rewindable<Type>>,
		Updatable<Type> {}

export interface ReversedStreamClassInstance<Type = any>
	extends BasicStreamClassInstance<Type>,
		Prevable<Type>,
		IsStartCurrable,
		Rewindable<Type> {
	basePrevIter: () => Type
}

export type * as init from "./methods/init.js"
