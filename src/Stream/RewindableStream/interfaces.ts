import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../BasicStream/interfaces.js"

export interface Rewindable<Type = any> extends Summat {
	rewind(): Type
}

export interface RewindableStream<Type = any>
	extends BasicStream<Type>,
		Rewindable<Type> {}
