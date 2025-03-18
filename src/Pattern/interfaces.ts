export interface Resulting<ResultType = any> {
	readonly result: ResultType
}

export interface IPointer<Type = any> {
	value: Type
}

export type Pattern<Type = any> = Partial<IPointer<Type>>

export type RecursivePointer<T = any> = IPointer<T | RecursivePointer<T>>

export interface GettablePattern<Type = any> {
	get: () => Type
}
