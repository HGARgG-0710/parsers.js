import type { Summat } from "@hgargg-0710/summat.ts"

export interface Pattern<Type = any> extends Summat {
	value?: Type
}

export interface Resulting<ResultType = any> extends Summat {
	result: ResultType
}

export interface Flushable extends Summat {
	flush: () => void
}

export interface Pointer<Type = any> extends Pattern<Type> {
	value: Type
}
