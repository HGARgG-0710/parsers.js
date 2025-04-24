import type { ICollection } from "../interfaces.js"

export interface IReadableSequence<Type = any> extends ICollection<Type> {
	read: (i: number) => Type
}

export interface ISequence<Type = any> extends IReadableSequence<Type> {
	emptied: () => typeof this
}

export interface IWritableSequence<Type = any> extends ISequence<Type> {
	write: (i: number, values: Type) => this
}

export interface IDynamicSequence<Type = any> extends IWritableSequence<Type> {
	insert: (i: number, ...values: Type[]) => this
	remove: (i: number, count?: number) => this
	truncate: (from: number, to?: number) => this
}

export interface IFreezableSequence<Type = any> extends ISequence<Type> {
	freeze: () => this
	readonly isFrozen: boolean
}

export interface IUnfreezableSequence<Type = any>
	extends IFreezableSequence<Type> {
	unfreeze: () => this
	isFrozen: boolean
}

export interface IBufferized<Type = any> {
	buffer: IFreezableSequence<Type>
}
