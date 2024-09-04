import type { Summat } from "@hgargg-0710/summat.ts"

export interface Inputted<Type = any> extends Summat {
	input: Type
}

export type BaseIterable<Type = any> = BaseNextable<Type> | BasePrevable<Type>

export interface BaseNextable<Type = any> extends Summat {
	baseNext(): Type
}

export interface BasePrevable<Type = any> extends Summat {
	basePrev(): Type
}

export interface Nextable<Type = any> extends Summat {
	next(): Type
}

export interface Prevable<Type = any> extends Summat {
	prev(): Type
}

export type BoundCheckable = IsEndCurrable | IsStartCurrable

export interface IsEndCurrable extends Summat {
	isCurrEnd: () => boolean
}

export interface IsStartCurrable extends Summat {
	isCurrStart: () => boolean
}

export * as UnderStream from "./UnderStream/interfaces.js"
export * as TreeStream from "./TreeStream/interfaces.js"
export * as TransformedStream from "./TransformedStream/interfaces.js"
export * as RewindableStream from "./RewindableStream/interfaces.js"
export * as ReversibleStream from "./ReversibleStream/interfaces.js"
export * as PreBasicStream from "./PreBasicStream/interfaces.js"
export * as PositionalStream from "./PositionalStream/interfaces.js"
export * as Position from "./PositionalStream/Position/interfaces.js"
export * as NestedStream from "./NestedStream/interfaces.js"
export * as NavigableStream from "./NavigableStream/interfaces.js"
export * as LimitedStream from "./LimitedStream/interfaces.js"
export * as IterationHandler from "./IterationHandler/interfaces.js"
export * as IterableStream from "./IterableStream/interfaces.js"
export * as InputStream from "./InputStream/interfaces.js"
export * as FinishableStream from "./FinishableStream/interfaces.js"
export * as CopiableStream from "./CopiableStream/interfaces.js"
export type Indexed<Type = any> = string |
	(Summat & {
		[x: number]: Type
		length: number
	})

export * as BasicStream from "./BasicStream/interfaces.js"
