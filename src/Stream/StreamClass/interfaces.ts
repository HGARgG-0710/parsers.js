import type { BasicStream } from "../BasicStream/interfaces.js"
import type { Summat } from "@hgargg-0710/summat.ts"
import type { Prevable, Started } from "../ReversibleStream/interfaces.js"

export type IterCheckPropNameType = "isCurrEnd" | "isCurrStart"
export type BaseIterPropNameType = "baseNextIter" | "basePrevIter"
export type IterPropNameType = "next" | "prev"
export type BoundNameType = "isEnd" | "isStart"

export type StartedType = 1 | boolean
export type StatefulStarted = Started<StartedType>

export interface IsEndCurrable extends Summat {
	isCurrEnd(): boolean
}

export interface IsStartCurrable extends Summat {
	isCurrStart(): boolean
}

export interface ConditionalIsStartCurrable extends Summat {
	isCurrStart?(): boolean
}

export interface BaseNextIterable<Type = any> extends Summat {
	baseNextIter(): Type
}

export interface ConditionalBasePrevIterable<Type = any> extends Summat {
	basePrevIter?(): Type
}

export interface InitGettable<Type = any> extends Summat {
	initGetter(): Type
}

export interface ConditionalInitGettable<Type = any> extends Summat {
	initGetter?(): Type
}

export interface RealCurrHaving<Type = any> extends Summat {
	realCurr: Type
}

export interface ConditionalCurrGettable<Type = any> extends Summat {
	currGetter?(): Type
}

export interface ConditionallyPrevable<Type = any> extends Summat {
	prev?(): Type
}

export interface DefaultEndable extends Summat {
	defaultIsEnd(): boolean
}

export interface EndableStream<Type = any> extends BasicStream<Type>, IsEndCurrable {}

export interface PrimalStreamClassSignature<Type = any>
	extends IsEndCurrable,
		BaseNextIterable<Type>,
		ConditionalCurrGettable<Type> {}

export interface StreamClassTransferable<Type = any>
	extends PrimalStreamClassSignature<Type>,
		ConditionalBasePrevIterable<Type>,
		ConditionalIsStartCurrable {}

export interface StreamClassSignature<Type = any>
	extends StreamClassTransferable<Type>,
		ConditionalInitGettable<Type>,
		DefaultEndable {}

export interface BasicStreamClassInstance<Type = any>
	extends InitGettable<Type>,
		PrimalStreamClassSignature<Type>,
		StatefulStarted,
		RealCurrHaving,
		BasicStream<Type> {}

export interface StreamClassInstance<Type = any>
	extends BasicStreamClassInstance<Type>,
		StreamClassTransferable<Type>,
		ConditionallyPrevable<Type>,
		ConditionalIsStartCurrable {}

export interface ReversedStreamClassInstance<Type = any>
	extends BasicStreamClassInstance<Type>,
		Prevable<Type>,
		IsStartCurrable {}
