import type {
	ICopiable,
	IFreezable,
	IGettable,
	IPushable,
	IReadable,
	ISizeable,
	IUnfreezable
} from "../interfaces.js";

export interface IAccumulator<Type = any, AccumulatedType = any>
	extends ICopiable,
		IFreezable,
		IPushable<Type>,
		IGettable<AccumulatedType>,
		IUnfreezable {}

export interface IPersistentAccumulator<Type = any>
	extends IAccumulator<Type, readonly Type[]>,
		ISizeable,
		IReadable<Type> {}
