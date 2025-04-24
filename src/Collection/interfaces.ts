import type { IGettable } from "src/interfaces.js"
import type { ICopiable, IIndexed, IInitializable } from "../interfaces.js"

export interface ICollection<Type = any>
	extends Iterable<Type>,
		IGettable<IIndexed<Type>>,
		ICopiable,
		IInitializable<[IIndexed<Type>?], ICollection<Type>> {
	push: (...x: Type[]) => this
	readonly size: number
}

export type * from "./Sequence/interfaces.js"
