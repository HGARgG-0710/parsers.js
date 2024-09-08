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

export interface Limitable<Type = any, LimitType = any> extends Summat {
	limit(limitPositions: LimitType): Type
}

export interface BasicLimited extends Summat {
	from: Position
	to: Position
}

export type LimitedSubUnderStream<Type = any> = PositionalStream<Type> &
	IsEndCurrable &
	IsStartCurrable

export type LimitedUnderStream<Type = any> = ReversibleStream<Type> &
	LimitedSubUnderStream<Type>

export interface LimitableStream<Type = any>
	extends BasicStream<Type>,
		Limitable<BasicStream<Type>, DualPosition> {}

export interface BoundableStream<Type = any>
	extends LimitableStream<Type>,
		LimitedUnderStream<Type> {}

export interface LimitedStream<Type = any>
	extends LimitedSubUnderStream<Type>,
		Inputted<LimitedUnderStream<Type>>,
		Iterable<Type>,
		BasicLimited,
		ReversedStreamClassInstance<Type> {}
