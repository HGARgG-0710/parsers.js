import type { IPointer } from "src/interfaces.js"
import type { ISupered } from "../../../interfaces.js"
import type { IReversibleStream } from "../../interfaces.js"
import type { IReversedStreamClassInstance } from "../interfaces.js"

export type IReversedStream<Type = any> = ISupered &
	IPointer<IReversibleStream<Type>> &
	IReversedStreamClassInstance<Type, IReversibleStream<Type>>
