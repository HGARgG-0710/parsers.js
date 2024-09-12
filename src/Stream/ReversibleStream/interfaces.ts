import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../BasicStream/interfaces.js"
import type { Inputted } from "../UnderStream/interfaces.js"
import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"

export interface Started<Type = boolean> extends Summat {
	isStart: Type
}

export interface Prevable<Type = any> extends Summat {
	prev(): Type
}

export interface StartedStream<Type = any> extends BasicStream<Type>, Started {}

export interface GeneralReversibleStream<Type = any, StartedType = any>
	extends BasicStream<Type>,
		Started<StartedType>,
		Prevable<Type> {}

export type ReversibleStream<Type = any> = GeneralReversibleStream<Type, boolean>

export interface ReversedStream<Type = any>
	extends Inputted<ReversibleStream<Type>>,
		ReversedStreamClassInstance<Type> {}

export type ChangeType = (input: ReversibleStream) => any
