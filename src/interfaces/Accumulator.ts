import type {
	ICopiable,
	IFreezable,
	IGettable,
	IPushable,
	IReadable,
	ISizeable,
	IUnfreezable
} from "../interfaces.js"

export interface IAccumulator<T = any, Accumulated = any>
	extends ICopiable,
		IFreezable,
		IPushable<T>,
		IGettable<Accumulated>,
		IUnfreezable {}

export interface IPersistentAccumulator<T = any>
	extends IAccumulator<T, readonly T[]>,
		ISizeable,
		IReadable<T> {}
