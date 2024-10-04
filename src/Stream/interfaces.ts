import type { Summat } from "@hgargg-0710/summat.ts"

export type Indexed<Type = any> =
	| string
	| (Summat & {
			[x: number]: Type
			length: number
	  })

export * as BasicStream from "./BasicStream/interfaces.js"
export * as InputStream from "./InputStream/interfaces.js"
export * as LimitedStream from "./LimitedStream/interfaces.js"
export * as NestedStream from "./NestedStream/interfaces.js"
export * as PositionalStream from "./PositionalStream/interfaces.js"
export * as PredicateStream from "./PredicateStream/interfaces.js"
export * as ProlongStream from "./ProlongedStream/interfaces.js"
export * as ReversibleStream from "./ReversibleStream/interfaces.js"
export * as StreamClass from "./StreamClass/interfaces.js"
export * as TransformedStream from "./TransformedStream/interfaces.js"
export * as TreeStream from "./TreeStream/interfaces.js"
export * as UnderStream from "./UnderStream/interfaces.js"
