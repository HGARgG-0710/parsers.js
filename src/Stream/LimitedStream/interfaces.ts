import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../BasicStream/interfaces.js"
import type { DualPosition } from "../PositionalStream/Position/interfaces.js"
import type { IterableStream } from "../IterableStream/interfaces.js"
import type { Inputted, BaseNextable, IsEndCurrable } from "../interfaces.js"
import type { PositionalStream } from "../PositionalStream/interfaces.js"

export interface Limitable<Type = any, LimitType = any> extends Summat {
	limit(limitPositions: LimitType): Type
}

export type LimitedUnderStream<Type = any> = PositionalStream<Type> &
	BaseNextable<Type> &
	IsEndCurrable

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
		BaseNextable<Type>,
		IsEndCurrable {}
