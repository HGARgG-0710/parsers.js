import type { Summat } from "@hgargg-0710/summat.ts"
import type { IBasicStream } from "../interfaces.js"
import type { IPrevable, IStarted } from "../ReversibleStream/interfaces.js"
import type { IInitializable } from "./methods/init.js"
import type { IPosition } from "../../Position/interfaces.js"
import type { ICopiable } from "../../interfaces.js"

// * Optional Property-interfaces

export interface IStateful<Type extends Summat = Summat> {
	readonly state: Type
}

// * Default Methods (single signature)

export interface IFinishable<Type = any> {
	finish: () => Type
}

export interface INavigable<Type = any> {
	navigate: (position: IPosition) => Type
}

export interface IRewindable<Type = any> {
	rewind: () => Type
}

export interface IUpdatable<Type = any> {
	update?: () => Type
}

// * Mandatory Property-interfaces

export interface IIsEndCurrable {
	isCurrEnd: () => boolean
}

export interface IIsStartCurrable {
	isCurrStart: () => boolean
}

export interface IEndableStream<Type = any>
	extends IBasicStream<Type>,
		IIsEndCurrable {}

interface IPrimalStreamClassSignature<Type = any> extends IIsEndCurrable {
	initGetter?: () => Type
	baseNextIter: () => Type
	defaultIsEnd: () => boolean
	currGetter?: () => Type
}

interface IStreamClassTransferable<Type = any>
	extends IPrimalStreamClassSignature<Type>,
		Partial<Pick<IReversedStreamClassInstance<Type>, "prev">>,
		Partial<Pick<IReversedStreamClassInstance<Type>, "basePrevIter">>,
		Partial<IIsStartCurrable> {}

interface IBasicStreamClassInstance<Type = any>
	extends IBasicStream<Type>,
		IInitializable,
		IPrimalStreamClassSignature<Type>,
		IStarted,
		INavigable<Type>,
		IFinishable<Type>,
		ICopiable,
		Iterable<Type> {
	["constructor"]: new (...x: any[]) => typeof this
}

export interface IStreamClassSignature<Type = any>
	extends IStreamClassTransferable<Type> {
	hasPosition?: boolean
	hasBuffer?: boolean
	hasState?: boolean
	isPattern?: boolean
}

export interface IStreamClassInstance<Type = any>
	extends IBasicStreamClassInstance<Type>,
		IStreamClassTransferable<Type>,
		Partial<IPrevable<Type>>,
		Partial<IIsStartCurrable>,
		Partial<IRewindable<Type>>,
		IUpdatable<Type> {}

export interface IReversedStreamClassInstance<Type = any>
	extends IBasicStreamClassInstance<Type>,
		IPrevable<Type>,
		IIsStartCurrable,
		IRewindable<Type> {
	basePrevIter: () => Type
}

export type * from "./methods/init.js"
