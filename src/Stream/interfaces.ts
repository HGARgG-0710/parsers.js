export interface IBasicStream<Type = any> {
	curr: Type
	isEnd: boolean
	next: () => Type
}

export type * from "./InputStream/interfaces.js"
export type * from "./LimitedStream/interfaces.js"
export type * from "./NestedStream/interfaces.js"
export type * from "./PredicateStream/interfaces.js"
export type * from "./ReversibleStream/interfaces.js"
export type * from "./StreamClass/interfaces.js"
export type * from "./StreamParser/interfaces.js"
export type * from "./TreeStream/interfaces.js"
export type * from "./Position/interfaces.js"
