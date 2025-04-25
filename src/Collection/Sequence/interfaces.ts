import type { ICopiable, IGettable } from "../../interfaces.js"
import type { ICollection, IPushable } from "../interfaces.js"

export interface IWritable<Type = any> {
	write: (i: number, value: Type) => this
}

export interface IFreezable {
	readonly isFrozen: boolean
	freeze: () => this
}

export interface IUnfreezable {
	unfreeze: () => this
}

export interface IAccumulator<Type = any, AccumulatedType = Type>
	extends ICopiable,
		IFreezable,
		IPushable<Type>,
		IGettable<AccumulatedType> {}

export interface IUnfreezableAccumulator<Type = any, AccumulatedType = any>
	extends IAccumulator<Type, AccumulatedType>,
		IUnfreezable {}

export interface IReadableSequence<Type = any> extends ICollection<Type> {
	read: (i: number) => Type
}

export interface ISequence<Type = any> extends IReadableSequence<Type> {
	emptied: () => typeof this
}

export interface IWritableSequence<Type = any>
	extends ISequence<Type>,
		IWritable<Type> {}

export interface IDynamicSequence<Type = any> extends IWritableSequence<Type> {
	insert: (i: number, ...values: Type[]) => this
	remove: (i: number, count?: number) => this
	truncate: (from: number, to?: number) => this
}

export interface IFreezableSequence<Type = any>
	extends ISequence<Type>,
		IFreezable {}

export interface IUnfreezableSequence<Type = any>
	extends IFreezableSequence<Type>,
		IUnfreezable {}

export interface IBufferized<Type = any> {
	buffer: IFreezableSequence<Type>
}
