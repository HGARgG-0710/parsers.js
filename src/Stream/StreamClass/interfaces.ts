import type { BasicStream } from "../interfaces.js"
import type { Summat } from "@hgargg-0710/summat.ts"
import type { Prevable, Started } from "../ReversibleStream/interfaces.js"
import type { Posed, Position } from "../../Position/interfaces.js"
import type { FreezableBuffer } from "src/Pattern/Collection/Buffer/interfaces.js"
import type { Pattern } from "src/Pattern/interfaces.js"
import type { Initializable } from "./methods/init.js"
import type { Navigable } from "./methods/navigate.js"
import type { Finishable } from "./methods/finish.js"
import type { Rewindable } from "./methods/rewind.js"

export type BoundNameType = "isEnd" | "isStart"
export type StartedType = 1 | boolean
export type StatefulStarted = Started<StartedType>

export type StreamConstructor<Type = any> = abstract new () => StreamClassInstance<Type>

export type ReversedStreamConstructor<Type = any> =
	abstract new () => ReversedStreamClassInstance<Type>

export type PatternStreamConstructor<Type = any> = abstract new (
	value: any
) => StreamClassInstance<Type> & Pattern

export type PatternReversedStreamConstructor<Type = any> = abstract new (
	value: any
) => ReversedStreamClassInstance<Type> & Pattern

export type BufferizedPatternReversedStreamConstructor<Type = any> = abstract new (
	value: any
) => BufferizedReversedStreamClassInstance<Type> & Pattern

// * Optional Property-interfaces

export interface Superable extends Summat {
	super: Summat
}

export interface Copiable<Type = any> extends Summat {
	copy: () => Type
}

export interface Stateful extends Summat {
	state: Summat
}

export interface Bufferized<Type = any> extends Summat {
	buffer: FreezableBuffer<Type>
}

// * Mandatory Property-interfaces

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
	initGetter?: () => Type
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

export interface Bufferizable extends Summat {
	buffer?: boolean
}

export interface StateHaving extends Summat {
	state?: boolean
}

export interface ConditionallyRewindable<Type = any> extends Summat {
	rewind?: () => Type
}

export interface HasPositionCheckable extends Summat {
	hasPosition?: boolean
}

export interface IsPatternCheckable extends Summat {
	isPattern?: boolean
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
		IsPatternCheckable,
		PreInitable,
		Bufferizable,
		StateHaving {}

export interface BasicStreamClassInstance<Type = any>
	extends BasicStream<Type>,
		InitGettable<Type>,
		Initializable,
		PrimalStreamClassSignature<Type>,
		StatefulStarted,
		RealCurrHaving<Type>,
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

export interface BufferizedStreamClassInstance<Type = any>
	extends StreamClassInstance<Type>,
		Bufferized<Type> {}

export interface StatefulStreamClassInstance<Type = any>
	extends StreamClassInstance<Type>,
		Stateful {}

export interface PositionalReversedStreamClassInstance<
	Type = any,
	PosType extends Position = number
> extends ReversedStreamClassInstance<Type>,
		Posed<PosType> {}

export interface BufferizedReversedStreamClassInstance<Type = any>
	extends ReversedStreamClassInstance<Type>,
		Bufferized<Type> {}

export interface PatternStreamClassInstance<Type = any>
	extends StreamClassInstance<Type>,
		Pattern {}
