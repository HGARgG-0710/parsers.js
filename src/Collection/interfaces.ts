import type { IIndexed } from "../interfaces.js"
import type { IGettablePattern } from "../Pattern/interfaces.js"

export interface ICollection<Type = any>
	extends Iterable<Type>,
		IGettablePattern<IIndexed<Type>> {
	push: (...x: Type[]) => this
}

export type * from "./Buffer/interfaces.js"
