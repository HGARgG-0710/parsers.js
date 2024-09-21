import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../BasicStream/interfaces.js"
import type { DualPosition, Position } from "../PositionalStream/Position/interfaces.js"
import type { Inputted } from "../UnderStream/interfaces.js"
import type { PositionalStream } from "../PositionalStream/interfaces.js"
import type { ReversibleStream } from "../ReversibleStream/interfaces.js"

import type {
	IsEndCurrable,
	IsStartCurrable,
	ReversedStreamClassInstance
} from "../StreamClass/interfaces.js"

import type {
	LookaheadHaving,
	SinglePositionLookahead
} from "../PredicateStream/interfaces.js"
import type { IterableStream } from "../IterableStream/interfaces.js"

export interface Limitable<Type = any, LimitType = any> extends Summat {
	limit(limitPositions: LimitType): Type
}

export interface BasicLimited extends Summat {
	from: Position
	to: Position
}

export type LimitedUnderStream<Type = any> = ReversibleStream<Type> &
	PositionalStream<Type> &
	IsEndCurrable &
	IsStartCurrable

export interface LimitableStream<Type = any>
	extends BasicStream<Type>,
		Limitable<BasicStream<Type>, DualPosition> {}

export interface BoundableStream<Type = any>
	extends LimitableStream<Type>,
		LimitedUnderStream<Type> {}

export interface LimitedStream<Type = any>
	extends BasicLimited,
		PositionalStream<Type, number>,
		SinglePositionLookahead<Type>,
		Inputted<LimitedUnderStream<Type>>,
		IterableStream<Type> {}

export interface EffectiveLimitedStream<Type = any>
	extends LimitedStream<Type>,
		LookaheadHaving,
		ReversedStreamClassInstance<Type> {}
