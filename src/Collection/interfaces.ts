import type { ICopiable, IIndexed } from "../interfaces.js"
import type { IGettablePattern } from "../Pattern/interfaces.js"

export interface ICollection<Type = any>
	extends Iterable<Type>,
		IGettablePattern<IIndexed<Type>>,
		ICopiable<ICollection<Type>> {
	push: (...x: Type[]) => this
}

export type * from "./Buffer/interfaces.js"
