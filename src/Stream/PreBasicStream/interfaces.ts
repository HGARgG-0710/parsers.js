import type { Summat } from "@hgargg-0710/summat.ts"

export interface Currable<Type = any> extends Summat {
	curr: Type
}

export interface Endable extends Summat {
	isEnd: boolean
}

export interface PreBasicStream<Type = any> extends Endable, Currable<Type> {}
