import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../interfaces.js"
import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { Superable } from "../StreamClass/interfaces.js"
import type { Pattern } from "../../Pattern/interfaces.js"

export interface Started<Type = boolean> extends Summat {
	isStart: Type
}

export interface Prevable<Type = any> extends Summat {
	prev: () => Type
}

export type ChangeType = (input: ReversibleStream) => any

export interface BasicReversibleStream<Type = any, StartedType = any>
	extends BasicStream<Type>,
		Started<StartedType>,
		Prevable<Type> {}

export type ReversibleStream<Type = any> = BasicReversibleStream<Type, boolean>

export interface ReversedStream<Type = any>
	extends Superable,
		Pattern<BasicReversibleStream<Type>>,
		ReversedStreamClassInstance<Type> {}
