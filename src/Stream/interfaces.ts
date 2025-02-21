export type Indexed<Type = any> =
	| string
	| {
			[x: number]: Type
			length: number
	  }

export interface BasicStream<Type = any> {
	curr: Type
	isEnd: boolean
	next: () => Type
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
