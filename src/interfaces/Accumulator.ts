import type {
	ICopiable,
	IGettable,
	IPushable,
	IReadable,
	ISizeable,
	IUnfreezable
} from "../interfaces.js"

/**
 * This interface is intended to represent objects
 * that are capable of being "gathered" piece-by-piece,
 * "accumulating" to a certain value of type `T`,
 * and encapsulated to be obtainable as `Accumulated`.
 *
 * Their construction can also be halted/continued at
 * will via the `.freeze/.unfreeze()` methods.
 */
export interface IAccumulator<T = any, Accumulated = T>
	extends ICopiable,
		IPushable<T>,
		IGettable<Accumulated>,
		IUnfreezable {}

/**
 * This interface is intended to serve as an
 * extension for the `IAccumulator<T, readonly T[]>`.
 * For objects fitting the `IPersistentAccumulator`,
 * it is (generally) intended for the access to it
 * via the `.read(i: number)` method to be persistent
 * (that is, to *not* change over time, unless explicitly
 * `.writ`-ten to).
 *
 * Note that it is (also) a valid `IParseable<T>`
 */
export interface IPersistentAccumulator<T = any>
	extends IAccumulator<T, readonly T[]>,
		ISizeable,
		IReadable<T> {}
