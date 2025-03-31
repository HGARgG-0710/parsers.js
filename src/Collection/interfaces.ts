import type { ICopiable, IIndexed } from "../interfaces.js"
import type { IGettable } from "src/interfaces.js"

export interface ICollection<Type = any>
	extends Iterable<Type>,
		IGettable<IIndexed<Type>>,
		ICopiable {
	push: (...x: Type[]) => this
	readonly size: number
}

export type * from "./Buffer/interfaces.js"
