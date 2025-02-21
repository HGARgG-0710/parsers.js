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

export interface Stateful {
	state: Summat
}

// * Mandatory Property-interfaces

export interface IsEndCurrable {
	isCurrEnd: () => boolean
}

export interface IsStartCurrable {
	isCurrStart: () => boolean
}

export interface Updatable<Type = any> {
	update?: () => Type
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
		PreStarted,
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
