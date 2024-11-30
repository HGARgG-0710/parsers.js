export interface Pattern<Type = any> {
	value?: Type
}

export interface Resulting<ResultType = any> {
	result: ResultType
}

export interface Flushable {
	flush: () => void
}

export interface Pointer<Type = any> extends Pattern<Type> {
	value: Type
}
