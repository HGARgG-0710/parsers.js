export interface Resulting<ResultType = any> {
	result: ResultType
}

export interface Flushable {
	flush: () => void
}

export interface Pointer<Type = any> {
	value: Type
}

export type Pattern<Type = any> = Partial<Pointer<Type>>

export type RecursivePointer<T = any> = Pointer<T | RecursivePointer<T>>
