import type { Summat } from "@hgargg-0710/summat.ts"

export interface Pattern<Type = any> extends Summat {
	value: Type
}

export interface Resulting<ResultType = any> extends Summat {
	result: ResultType
}

export interface Flushable extends Summat {
	flush(): void
}

export * as Collection from "./Collection/interfaces.js"
export * as EliminablePattern from "./EliminablePattern/interfaces.js"
export * as EnumSpace from "./EnumSpace/interfaces.js"
export * as Token from "./Token/interfaces.js"
export * as TokenizablePattern from "./TokenizablePattern/interfaces.js"
export * as ValidatablePattern from "./ValidatablePattern/interfaces.js"
