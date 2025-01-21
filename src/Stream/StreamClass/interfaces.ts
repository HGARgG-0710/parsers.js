import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../interfaces.js"
import type { Prevable, Started } from "../ReversibleStream/interfaces.js"
import type { Posed, Position } from "../../Position/interfaces.js"
import type { Bufferized } from "../../Collection/Buffer/interfaces.js"
import type { Pattern } from "../../Pattern/interfaces.js"
import type { Initializable } from "./methods/init.js"
import type { Navigable } from "./methods/navigate.js"
import type { Finishable } from "./methods/finish.js"
import type { Rewindable } from "./methods/rewind.js"

export type BoundNameType = "isEnd" | "isStart"
export type StartedType = 1 | boolean
export type PreStarted = Started<StartedType>

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

export interface Superable {
	super: Summat
}

export interface Copiable<Type = any> {
	copy: () => Type
}

export interface FrozenStateful {
	state: object
}

export interface Stateful {
	state: Summat
}

export interface OptStateful {
	state?: Summat
}

// * Mandatory Property-interfaces

export interface IsEndCurrable {
	isCurrEnd: () => boolean
}

export interface IsStartCurrable {
	isCurrStart: () => boolean
}

export interface ConditionalIsStartCurrable {
	isCurrStart?: () => boolean
}

export interface BaseNextIterable<Type = any> {
	baseNextIter: () => Type
}

export interface BasePrevIterable<Type = any> {
	basePrevIter: () => Type
}

export interface ConditionalBasePrevIterable<Type = any> {
	basePrevIter?: () => Type
}

export interface InitGettable<Type = any> {
	initGetter?: () => Type
}

export interface ConditionalInitGettable<Type = any> {
	initGetter?: () => Type
}

export interface RealCurrHaving<Type = any> {
	realCurr: Type
}

export interface ConditionalCurrGettable<Type = any> {
	currGetter?: () => Type
}

export interface ConditionallyPrevable<Type = any> {
	prev?: () => Type
}

export interface ConditionallyUpdatable<Type = any> {
	update?: () => Type
}

export interface DefaultEndable {
	defaultIsEnd: () => boolean
}

export interface Bufferizable {
	buffer?: boolean
}

export interface StateHaving {
	state?: boolean
}

export interface ConditionallyRewindable<Type = any> {
	rewind?: () => Type
}

export interface HasPositionCheckable {
	hasPosition?: boolean
}

export interface IsPatternCheckable {
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
		Bufferizable,
		StateHaving {}

export interface BasicStreamClassInstance<Type = any>
	extends BasicStream<Type>,
		InitGettable<Type>,
		Initializable,
		PrimalStreamClassSignature<Type>,
		PreStarted,
		RealCurrHaving<Type>,
		Navigable<Type>,
		Finishable<Type>,
		Iterable<Type> {}

export interface StreamClassInstance<Type = any>
	extends BasicStreamClassInstance<Type>,
		StreamClassTransferable<Type>,
		ConditionallyPrevable<Type>,
		ConditionalIsStartCurrable,
		ConditionallyRewindable<Type>,
		ConditionallyUpdatable<Type> {}

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

export interface PositionalBufferizedStreamClassInstance<Type = any>
	extends PositionalStreamClassInstance<Type>,
		BufferizedStreamClassInstance<Type> {}

export type * as finish from "./methods/finish.js"
export type * as init from "./methods/init.js"
export type * as navigate from "./methods/navigate.js"
export type * as rewind from "./methods/rewind.js"
