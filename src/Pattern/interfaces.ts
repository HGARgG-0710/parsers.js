import type { Summat } from "@hgargg-0710/summat.ts"

export interface Pattern<Type = any> extends Summat {
	value: Type
}

export interface Resulting<ResultType = any> extends Summat {
	result: ResultType
}

export interface Flushable extends Summat {
	flush: () => void
}

export type * as Collection from "./Collection/interfaces.js"
export type * as EliminablePattern from "./EliminablePattern/interfaces.js"
export type * as EnumSpace from "./EnumSpace/interfaces.js"
export type * as Token from "./Token/interfaces.js"
export type * as TokenizablePattern from "./TokenizablePattern/interfaces.js"
export type * as ValidatablePattern from "./ValidatablePattern/interfaces.js"
