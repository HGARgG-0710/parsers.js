import type {
	IClearable,
	IGettable,
	IPushable,
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
	extends IPushable<T>,
		IGettable<Accumulated>,
		IUnfreezable,
		IClearable {}
