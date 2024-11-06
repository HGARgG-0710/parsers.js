import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../interfaces.js"
import type { Position, Posed } from "../../Position/interfaces.js"
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
import type { Superable } from "../StreamClass/interfaces.js"
import type { Pattern } from "src/Pattern/interfaces.js"

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

export interface LimitedStream<Type = any>
	extends BasicStream<Type>,
		BasicLimited,
		SinglePositionLookahead<Type>,
		Pattern<LimitedUnderStream<Type>> {}

export interface EffectiveLimitedStream<Type = any>
	extends LimitedStream<Type>,
		LookaheadHaving,
		Superable,
		Directioned,
		ReversedStreamClassInstance<Type> {}
