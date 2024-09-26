import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../BasicStream/interfaces.js"
import type { Inputted } from "../UnderStream/interfaces.js"
import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { IterableStream } from "../IterableStream/interfaces.js"

export interface Started<Type = boolean> extends Summat {
	isStart: Type
}

export interface Prevable<Type = any> extends Summat {
	prev(): Type
}

export interface StartedStream<Type = any> extends BasicStream<Type>, Started {}

export interface BasicReversibleStream<Type = any, StartedType = any>
	extends IterableStream<Type>,
		Started<StartedType>,
		Prevable<Type> {}

export type ReversibleStream<Type = any> = BasicReversibleStream<Type, boolean>

export interface ReversedStream<Type = any>
	extends Inputted<BasicReversibleStream<Type>>,
		ReversedStreamClassInstance<Type> {}

export type ChangeType = (input: ReversibleStream) => any
