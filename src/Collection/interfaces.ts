import type { Indexed } from "src/interfaces.js"

export interface Collection<Type = any> extends Iterable<Type> {
	push: (...x: Type[]) => this
	get: () => Indexed<Type>
}

export type * from "./Buffer/interfaces.js"
