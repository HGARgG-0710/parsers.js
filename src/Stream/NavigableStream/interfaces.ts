import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../BasicStream/interfaces.js"
import type { Position } from "../PositionalStream/Position/interfaces.js"

export interface Navigable<Type = any, PosType = any> extends Summat {
	navigate(position: PosType): Type
}

export interface NavigableStream<Type = any>
	extends BasicStream<Type>,
		Navigable<Type | void, Position> {}
