export interface IPointer<Type = any> {
	value: Type
}

export type IPattern<Type = any> = Partial<IPointer<Type>>

export type IRecursivePointer<T = any> = IPointer<T | IRecursivePointer<T>>

export interface IGettablePattern<Type = any> {
	get: () => Type
}
