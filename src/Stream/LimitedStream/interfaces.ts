import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../interfaces.js"
import type { Position } from "../PositionalStream/Position/interfaces.js"
import type { Inputted } from "../UnderStream/interfaces.js"
import type { Posed } from "../PositionalStream/interfaces.js"
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
import type { Superable } from "src/Stream/StreamClass/Superable/interfaces.js"

export interface Limitable<Type = any> extends Summat {
	limit: (from?: Position, to?: Position) => Type
}

export interface BasicLimited extends Summat {
	from: Position
	to: Position
}

export interface Directioned extends Summat {
	direction: boolean
}

export type LimitedUnderStream<Type = any> = ReversibleStream<Type> &
	Posed<Position> &
	IsEndCurrable &
	IsStartCurrable

export interface BoundableStream<Type = any>
	extends Limitable<BasicStream<Type>>,
		LimitedUnderStream<Type> {}

export interface LimitedStream<Type = any>
	extends BasicStream<Type>,
		BasicLimited,
		Posed<number>,
		SinglePositionLookahead<Type>,
		Inputted<LimitedUnderStream<Type>>,
		Superable,
		Iterable<Type> {}

export interface EffectiveLimitedStream<Type = any>
	extends LimitedStream<Type>,
		LookaheadHaving,
		Directioned,
		ReversedStreamClassInstance<Type> {}
