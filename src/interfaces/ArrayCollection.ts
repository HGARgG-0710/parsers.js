import type {
	IGettable,
	IIndexed,
	ICopiable,
	IInitializable,
	IPushable,
	IWritable,
	IReadable
} from "../interfaces.js"

export interface ICollection<Type = any>
	extends IGettable<IIndexed<Type>>,
		ICopiable,
		IPushable<Type>,
		IWritable<Type>,
		Iterable<Type>,
		IReadable<Type> {
	readonly size: number
}
