import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream, EssentialStream } from "../BasicStream/interfaces.js"
import type { Position } from "./Position/interfaces.js"
import type { IterableStream } from "../IterableStream/interfaces.js"
import type { Inputted } from "../interfaces.js"

export interface Posed<Type = any> extends Summat {
	pos: Type
}

export interface PositionalStream<Type = any, PosType extends Position = Position>
	extends BasicStream<Type>,
		Posed<PosType> {}

export interface PositionalInputtedStream<Type = any, PosType extends Position = Position>
	extends PositionalStream<Type, PosType>,
		Inputted<BasicStream<Type>>,
		IterableStream<Type>,
		EssentialStream<Type> {}
