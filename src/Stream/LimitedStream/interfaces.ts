import type { Summat } from "@hgargg-0710/summat.ts"
import type {
	BaseStream,
	BasicStream,
	EssentialStream,
	ReverseBaseStream
} from "../BasicStream/interfaces.js"
import type { DualPosition, Position } from "../PositionalStream/Position/interfaces.js"
import type { IterableStream } from "../IterableStream/interfaces.js"
import type { Inputted } from "../UnderStream/interfaces.js"
import type { PositionalStream } from "../PositionalStream/interfaces.js"
import type { ReversibleStream } from "../ReversibleStream/interfaces.js"

export interface Limitable<Type = any, LimitType = any> extends Summat {
	limit(limitPositions: LimitType): Type
}

export interface BasicLimited extends Summat {
	from: Position
	to: Position
}

export type LimitedUnderStream<Type = any> = PositionalStream<Type> &
	ReversibleStream<Type> &
	ReverseBaseStream<Type> &
	BaseStream<Type>

export interface LimitableStream<Type = any>
	extends BasicStream<Type>,
		Limitable<BasicStream<Type>, DualPosition> {}

export interface BoundableStream<Type = any>
	extends LimitableStream<Type>,
		LimitedUnderStream<Type>,
		IterableStream<Type> {}

export interface LimitedStream<Type = any>
	extends BoundableStream<Type>,
		Inputted<LimitedUnderStream<Type>>,
		IterableStream<Type>,
		EssentialStream<Type>,
		BasicLimited,
		ReverseBaseStream<Type> {}
