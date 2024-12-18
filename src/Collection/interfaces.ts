export interface Collection<Type = any> extends Iterable<Type> {
	push: (...x: Type[]) => Collection<Type>
}

export * as Buffer from "./Buffer/interfaces.js"
