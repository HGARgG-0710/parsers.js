import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../BasicStream/interfaces.js"
import type { PositionalStream } from "../PositionalStream/interfaces.js"
import type { StreamClassInstance } from "../StreamClass/interfaces.js"
import type { Inputted } from "../UnderStream/interfaces.js"
import type { IterableStream } from "../IterableStream/interfaces.js"

export interface StreamIndexed extends Summat {
	streamIndex: number
}

export interface BasicProlonged<Type = any>
	extends PositionalStream<Type, number>,
		StreamIndexed,
		IterableStream<Type> {}

export interface ProlongedStream<Type = any>
	extends BasicProlonged<Type>,
		Inputted<BasicStream<Type>[]> {}

export interface EffectiveProlongedStream<Type = any>
	extends BasicProlonged<Type>,
		Inputted<StreamClassInstance<Type>[]>,
		StreamClassInstance<Type> {}
