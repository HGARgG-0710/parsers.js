import type { IBasicStream } from "../interfaces.js"
import type { IReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { ISupered } from "src/interfaces.js"
import type { IPattern } from "../../Pattern/interfaces.js"

export interface IStarted {
	isStart: boolean
}

export interface IPrevable<Type = any> {
	prev: () => Type
}

export interface IReversibleStream<Type = any>
	extends IBasicStream<Type>,
		IStarted,
		IPrevable<Type> {}

export interface IReversedStream<Type = any>
	extends ISupered,
		IPattern<IReversibleStream<Type>>,
		IReversedStreamClassInstance<Type> {}
