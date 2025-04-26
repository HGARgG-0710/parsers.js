import type {
	IGettable,
	IIndexed,
	ICopiable,
	IInitializable,
	IPushable
} from "../interfaces.js"

export interface ICollection<Type = any>
	extends IGettable<IIndexed<Type>>,
		ICopiable,
		IInitializable,
		IPushable<Type> {
	readonly size: number
}
