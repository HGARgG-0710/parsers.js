import type { Summat } from "@hgargg-0710/summat.ts"

export type Indexed<Type = any> =
	| string
	| (Summat & {
			[x: number]: Type
			length: number
	  })

export interface BasicStream<Type = any>
	extends Endable,
		Currable<Type>,
		Nextable<Type> {}

export interface Endable extends Summat {
	isEnd: boolean
}

export interface Nextable<Type = any> extends Summat {
	next: () => Type
}

export interface Currable<Type = any> extends Summat {
	curr: Type
}

export type * from "./InputStream/interfaces.js"
export type * from "./LimitedStream/interfaces.js"
export type * from "./NestedStream/interfaces.js"
export type * from "./PredicateStream/interfaces.js"
export type * from "./ProlongedStream/interfaces.js"
export type * as ReversibleStream from "./ReversibleStream/interfaces.js"
export type * as StreamClass from "./StreamClass/interfaces.js"
export type * from "./StreamParser/interfaces.js"
export type * from "./TreeStream/interfaces.js"
