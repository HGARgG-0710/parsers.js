import type {
	ICopiable,
	IFiniteWritable,
	IGettable,
	IIndexed,
	IPushable,
	IReadable
} from "../interfaces.js"

export interface ICollection<T = any>
	extends IGettable<IIndexed<T>>,
		ICopiable,
		IPushable<T>,
		IFiniteWritable<T>,
		Iterable<T>,
		IReadable<T> {}
