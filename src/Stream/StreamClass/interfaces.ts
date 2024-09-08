import type { BasicStream } from "../BasicStream/interfaces.js"
import type { Summat } from "@hgargg-0710/summat.ts"

export type IterCheckPropNameType = "isCurrEnd" | "isCurrStart"
export type BaseIterPropNameType = "baseNextIter" | "basePrevIter"
export type IterPropNameType = "next" | "prev"
export type BoundNameType = "isEnd" | "isStart"

export type StartedType = 1 | boolean

export interface StatefulStarted extends Summat {
	isStart: StartedType
}

export interface IsEndCurrable extends Summat {
	isCurrEnd(): boolean
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

export interface StreamClassTransferable<Type = any>
	extends IsEndCurrable,
		BaseNextIterable,
		ConditionalCurrGettable<Type>,
		ConditionalBasePrevIterable<Type>,
		ConditionalIsStartCurrable {}

export interface StreamClassSignature<Type = any>
	extends StreamClassTransferable<Type>,
		ConditionalInitGettable<Type> {}

export interface StreamClassInstance<Type = any>
	extends Summat,
		InitGettable<Type>,
		StreamClassTransferable<Type>,
		StatefulStarted,
		RealCurrHaving,
		ConditionallyPrevable<Type>,
		BasicStream<Type> {}
