export interface Resulting<ResultType = any> {
	result: ResultType
}

export interface Flushable {
	flush: () => void
}

export interface Pointer<Type = any> {
	value: Type
}

export type Pattern<Type = any> = Pointer<Type | undefined>
