import type { BasicStream } from "../interfaces.js"
import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { Supered } from "src/interfaces.js"
import type { Pattern } from "../../Pattern/interfaces.js"

export interface Started {
	isStart: boolean
}

export interface Prevable<Type = any> {
	prev: () => Type
}

export interface ReversibleStream<Type = any>
	extends BasicStream<Type>,
		Started,
		Prevable<Type> {}

export interface IReversedStream<Type = any>
	extends Supered,
		Pattern<ReversibleStream<Type>>,
		ReversedStreamClassInstance<Type> {}
