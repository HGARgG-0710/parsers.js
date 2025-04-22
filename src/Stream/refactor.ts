export interface ILookaheadHaving {
	hasLookAhead: boolean
}

export interface IWithLookahead<Type> {
	lookAhead: Type
}

export interface IProddable<Type = any> {
	prod: () => Type
}
