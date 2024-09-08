import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../BasicStream/interfaces.js"
import type { Position } from "./Position/interfaces.js"
import type { Inputted } from "../UnderStream/interfaces.js"
import type { StreamClassInstance } from "../StreamClass/interfaces.js"

export interface Posed<Type = any> extends Summat {
	pos: Type
}

export interface PositionalStream<Type = any, PosType extends Position = Position>
	extends BasicStream<Type>,
		Posed<PosType> {}

export interface PositionalInputtedStream<Type = any, PosType extends Position = Position>
	extends PositionalStream<Type, PosType>,
		Inputted<BasicStream<Type>>,
		Iterable<Type>,
		StreamClassInstance<Type> {}
