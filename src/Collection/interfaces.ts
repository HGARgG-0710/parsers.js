import type { IGettable } from "src/interfaces.js"
import type { ICopiable, IIndexed, IInitializable } from "../interfaces.js"

export interface IPushable<Type = any> {
	push: (...x: Type[]) => this
}

export interface ICollection<Type = any>
	extends IGettable<IIndexed<Type>>,
		ICopiable,
		IInitializable<[IIndexed<Type>?], ICollection<Type>>,
		IPushable<Type> {
	readonly size: number
}

export type * from "./Sequence/interfaces.js"
