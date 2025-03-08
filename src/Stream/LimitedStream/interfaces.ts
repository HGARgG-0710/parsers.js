import type { Position, Posed, DirectionHaving } from "../../Position/interfaces.js"
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

import type { Supered } from "src/interfaces.js"
import type { Pattern } from "../../Pattern/interfaces.js"

export type LimitedUnderStream<Type = any> = ReversibleStream<Type> &
	Posed<Position> &
	IsEndCurrable &
	IsStartCurrable

export interface ILimitedStream<Type = any>
	extends SinglePositionLookahead<Type>,
		Pattern<LimitedUnderStream<Type>>,
		LookaheadHaving,
		Supered,
		ReversedStreamClassInstance<Type>,
		DirectionHaving {
	from: Position
	to: Position
}
