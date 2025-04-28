import type {
	IGettable,
	IIndexed,
	ICopiable,
	IInitializable,
	IPushable,
	IWritable
} from "../interfaces.js"

export interface ICollection<Type = any>
	extends IGettable<IIndexed<Type>>,
		ICopiable,
		IInitializable,
		IPushable<Type>,
		IWritable<Type> {
	readonly size: number
}
