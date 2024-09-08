import type { Summat } from "@hgargg-0710/summat.ts"
import type { PreBasicStream } from "../PreBasicStream/interfaces.js"

export interface BasicStream<Type = any> extends PreBasicStream<Type>, Nextable<Type> {}
export interface Nextable<Type = any> extends Summat {
	next(): Type
}export interface Currable<Type = any> extends Summat {
	curr: Type
}
export interface Endable extends Summat {
	isEnd: boolean
}

