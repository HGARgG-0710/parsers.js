import type { Indexed } from "../Stream/interfaces.js"

export interface Collection<Type = any> extends Iterable<Type> {
	push: (...x: Type[]) => this
	get: () => Indexed<Type>
}

export type * as Buffer from "./Buffer/interfaces.js"
