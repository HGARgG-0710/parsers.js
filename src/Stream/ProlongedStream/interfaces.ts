import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../interfaces.js"
import type { Posed } from "../PositionalStream/interfaces.js"
import type { StreamClassInstance } from "../StreamClass/interfaces.js"
import type { Inputted } from "../UnderStream/interfaces.js"
import type { Superable } from "../StreamClass/Superable/interfaces.js"

export interface StreamIndexed extends Summat {
	streamIndex: number
}

export interface BasicProlonged extends Posed<number>, StreamIndexed {}

export interface ProlongedStream<Type = any>
	extends BasicStream<Type>,
		BasicProlonged,
		Inputted<BasicStream<Type>[]> {}

export interface EffectiveProlongedStream<Type = any>
	extends BasicProlonged,
		Superable,
		Inputted<StreamClassInstance<Type>[]>,
		StreamClassInstance<Type> {}
