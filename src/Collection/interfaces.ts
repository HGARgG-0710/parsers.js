import type { Pattern } from "../Pattern/interfaces.js"

export interface Collection<Type = any> extends Pattern, Iterable<Type> {
	push: (...x: Type[]) => Collection<Type>
}

export * as Buffer from "./Buffer/interfaces.js"
