import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../BasicStream/interfaces.js"
import type { IterableStream } from "../IterableStream/interfaces.js"
import type {
	BaseNextable,
	BasePrevable} from "../interfaces.js"
import type { Inputted } from "../UnderStream/interfaces.js"
import type { IsEndCurrable } from "../StreamClass/interfaces.js"
import type { IsStartCurrable } from "../StreamClass/interfaces.js"

export interface Started extends Summat {
	isStart: boolean
}

export interface StartedStream<Type = any> extends BasicStream<Type>, Started {}

export interface ReversibleStream<Type = any>
	extends StartedStream<Type>,
		Prevable<Type> {}

export interface ReversedStream<Type = any>
	extends ReversibleStream<Type>,
		Inputted<ReversibleStream<Type>>,
		IterableStream<Type>,
		BaseNextable<Type>,
		IsEndCurrable,
		BasePrevable<Type>,
		IsStartCurrable {}

export type ChangeType = (input: ReversibleStream) => anyexport interface Prevable<Type = any> extends Summat {
	prev(): Type
}

