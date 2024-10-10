import type { BasicStream } from "../interfaces.js"
import type { Summat } from "@hgargg-0710/summat.ts"
import type { Prevable, Started } from "../ReversibleStream/interfaces.js"
import type { Posed, Position } from "../../Position/interfaces.js"

export type BoundNameType = "isEnd" | "isStart"
export type StartedType = 1 | boolean
export type StatefulStarted = Started<StartedType>

// * Optional Property-interfaces

export interface Superable extends Summat {
	super: Summat
}

export interface Stateful extends Summat {
	state: Summat
}

export interface Copiable<Type = any> extends Summat {
	copy: () => Type
}

export interface Inputted<Type = any> extends Summat {
	input: Type
}

// * Mandatory Property-interfaces

export interface Initializable<Type = any> extends Summat {
	init: (...x: any[]) => Type
}

export interface Navigable<Type = any> extends Summat {
	navigate: (position: Position) => Type
}

export interface Finishable<Type = any> extends Summat {
	finish: () => Type
}

export interface Rewindable<Type = any> extends Summat {
	rewind: () => Type
}

export interface IsEndCurrable extends Summat {
	isCurrEnd: () => boolean
}

export interface IsStartCurrable extends Summat {
	isCurrStart: () => boolean
}

export interface ConditionalIsStartCurrable extends Summat {
	isCurrStart?: () => boolean
}

export interface BaseNextIterable<Type = any> extends Summat {
	baseNextIter: () => Type
}

export interface BasePrevIterable<Type = any> extends Summat {
	basePrevIter: () => Type
}

export interface ConditionalBasePrevIterable<Type = any> extends Summat {
	basePrevIter?: () => Type
}

export interface InitGettable<Type = any> extends Summat {
	initGetter: () => Type
}

export interface ConditionalInitGettable<Type = any> extends Summat {
	initGetter?: () => Type
}

export interface RealCurrHaving<Type = any> extends Summat {
	realCurr: Type
}

export interface ConditionalCurrGettable<Type = any> extends Summat {
	currGetter?: () => Type
}

export interface ConditionallyPrevable<Type = any> extends Summat {
	prev?: () => Type
}

export interface DefaultEndable extends Summat {
	defaultIsEnd: () => boolean
}

export interface PreInitable extends Summat {
	preInit?: boolean
}

export interface ConditionallyRewindable<Type = any> extends Summat {
	rewind?: () => Type
}

export interface HasPositionCheckable extends Summat {
	hasPosition?: boolean
}

export interface EndableStream<Type = any> extends BasicStream<Type>, IsEndCurrable {}

export interface PrimalStreamClassSignature<Type = any>
	extends IsEndCurrable,
		BaseNextIterable<Type>,
		ConditionalCurrGettable<Type>,
		DefaultEndable {}

export interface StreamClassTransferable<Type = any>
	extends PrimalStreamClassSignature<Type>,
		ConditionalBasePrevIterable<Type>,
		ConditionalIsStartCurrable {}

export interface StreamClassSignature<Type = any>
	extends StreamClassTransferable<Type>,
		ConditionalInitGettable<Type>,
		HasPositionCheckable,
		PreInitable {}

export interface BasicStreamClassInstance<Type = any>
	extends BasicStream<Type>,
		InitGettable<Type>,
		Initializable<void>,
		PrimalStreamClassSignature<Type>,
		StatefulStarted,
		RealCurrHaving,
		Navigable<Type>,
		Finishable<Type>,
		Iterable<Type> {}

export interface StreamClassInstance<Type = any>
	extends BasicStreamClassInstance<Type>,
		StreamClassTransferable<Type>,
		ConditionallyPrevable<Type>,
		ConditionalIsStartCurrable,
		ConditionallyRewindable<Type> {}

export interface ReversedStreamClassInstance<Type = any>
	extends BasicStreamClassInstance<Type>,
		BasePrevIterable<Type>,
		Prevable<Type>,
		IsStartCurrable,
		Rewindable<Type> {}

export interface PositionalStreamClassInstance<
	Type = any,
	PosType extends Position = number
> extends StreamClassInstance<Type>,
		Posed<PosType> {}

export interface PositionalReversedStreamClassInstance<
	Type = any,
	PosType extends Position = number
> extends ReversedStreamClassInstance<Type>,
		Posed<PosType> {}
