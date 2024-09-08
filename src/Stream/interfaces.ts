import type { Summat } from "@hgargg-0710/summat.ts"

export type Indexed<Type = any> =
	| string
	| (Summat & {
			[x: number]: Type
			length: number
	  })

export * as UnderStream from "./UnderStream/interfaces.js"
export * as TreeStream from "./TreeStream/interfaces.js"
export * as TransformedStream from "./TransformedStream/interfaces.js"
export * as RewindableStream from "./RewindableStream/interfaces.js"
export * as ReversibleStream from "./ReversibleStream/interfaces.js"
export * as PreBasicStream from "./PreBasicStream/interfaces.js"
export * as PositionalStream from "./PositionalStream/interfaces.js"
export * as NestedStream from "./NestedStream/interfaces.js"
export * as NavigableStream from "./NavigableStream/interfaces.js"
export * as LimitedStream from "./LimitedStream/interfaces.js"
export * as IterationHandler from "./StreamClass/interfaces.js"
export * as IterableStream from "./IterableStream/interfaces.js"
export * as InputStream from "./InputStream/interfaces.js"
export * as FinishableStream from "./FinishableStream/interfaces.js"
export * as CopiableStream from "./CopiableStream/interfaces.js"
export * as BasicStream from "./BasicStream/interfaces.js"
