import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../interfaces.js"
import type { StreamClassInstance } from "../StreamClass/interfaces.js"
import type { Superable } from "../StreamClass/interfaces.js"
import type { Pattern } from "../../Pattern/interfaces.js"

export interface StreamIndexed extends Summat {
	streamIndex: number
}

export interface ProlongedStream<Type = any>
	extends BasicStream<Type>,
		StreamIndexed,
		Pattern<BasicStream<Type>[]> {}

export interface EffectiveProlongedStream<Type = any>
	extends StreamIndexed,
		Superable,
		Pattern<StreamClassInstance<Type>[]>,
		StreamClassInstance<Type> {}
