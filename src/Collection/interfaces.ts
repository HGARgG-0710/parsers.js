import type { Indexed } from "../Stream/interfaces.js"

export interface Collection<Type = any> extends Iterable<Type> {
	push: (...x: Type[]) => any
	get: () => Indexed<Type>
}

export * as Buffer from "./Buffer/interfaces.js"
