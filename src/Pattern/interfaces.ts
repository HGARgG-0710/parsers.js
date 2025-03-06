export interface Resulting<ResultType = any> {
	result: ResultType
}

export interface Flushable {
	flush: () => void
}

export interface IPointer<Type = any> {
	value: Type
}

export type Pattern<Type = any> = Partial<IPointer<Type>>

export type RecursivePointer<T = any> = IPointer<T | RecursivePointer<T>>
