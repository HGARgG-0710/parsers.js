import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../BasicStream/interfaces.js"
import type { PositionalStream } from "../PositionalStream/interfaces.js"
import type { StreamClassInstance } from "../StreamClass/interfaces.js"
import type { Inputted } from "../UnderStream/interfaces.js"

export interface StreamIndexed extends Summat {
	streamIndex: number
}

export interface ProlongedStream<Type = any>
	extends PositionalStream<Type, number>,
		Inputted<BasicStream<Type>[]>,
		StreamIndexed {}

export interface EffectiveProlongedStream<Type = any>
	extends PositionalStream<Type, number>,
		Inputted<StreamClassInstance<Type>[]>,
		StreamClassInstance<Type>,
		StreamIndexed {}
