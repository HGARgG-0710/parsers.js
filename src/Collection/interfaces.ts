import type { ICopiable, IIndexed } from "../interfaces.js"
import type { IGettablePattern } from "../Pattern/interfaces.js"

export interface ICollection<Type = any>
	extends Iterable<Type>,
		IGettablePattern<IIndexed<Type>>,
		ICopiable {
	push: (...x: Type[]) => this
	readonly size: number
}

export type * from "./Buffer/interfaces.js"
