import type {
	ICopiable,
	IFiniteWritable,
	IGettable,
	IIndexed,
	IPushable,
	IReadable
} from "../interfaces.js"

export interface ICollection<Type = any>
	extends IGettable<IIndexed<Type>>,
		ICopiable,
		IPushable<Type>,
		IFiniteWritable<Type>,
		Iterable<Type>,
		IReadable<Type> {}
