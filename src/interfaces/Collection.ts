import type {
	ICopiable,
	IFiniteWritable,
	IGettable,
	IIndexed,
	IPushable,
	IReadable
} from "../interfaces.js"

/**
 * This is an interface intended to represent a
 * simple read-write collection of items,
 * which permits writing to an arbitrary
 * index, as well as adding items to the end, 
 * and obtaining the encapsulated result as 
 * the type `C`, defaulting to the generic `IIndexed<T>`.
 * 
 * It is deliberately simpler and more multipurposed 
 * than `IAccumulator`, but less so than the `IArray`. 
 * It is not intended to be operated on too actively. 
 */
export interface ICollection<T = any, C extends IIndexed<T> = any>
	extends IGettable<C>,
		ICopiable,
		IPushable<T>,
		IFiniteWritable<T>,
		Iterable<T>,
		IReadable<T> {}
