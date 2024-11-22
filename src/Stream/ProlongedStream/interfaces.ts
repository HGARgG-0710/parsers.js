import type { StreamClassInstance } from "../StreamClass/interfaces.js"
import type { Superable } from "../StreamClass/interfaces.js"
import type { Pattern } from "../../Pattern/interfaces.js"

export interface ProlongedStream<Type = any>
	extends Superable,
		Pattern<StreamClassInstance<Type>[]>,
		StreamClassInstance<Type> {
	streamIndex: number
}
