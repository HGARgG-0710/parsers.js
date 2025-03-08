export interface Eliminable<EliminatedType = any, Type = any> {
	eliminate: (eliminated: EliminatedType) => Type
}
