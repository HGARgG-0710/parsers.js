import type { ICollection } from "../interfaces.js"

export interface IBuffer<Type = any> extends ICollection<Type> {
	read: (i: number) => Type
	write: (i: number, values: Type) => this
	emptied: () => typeof this
}

export interface IDynamicBuffer<Type = any> extends IBuffer<Type> {
	insert: (i: number, ...values: Type[]) => this
	remove: (i: number, count?: number) => this
	truncate: (from: number, to?: number) => this
}

export interface IFreezableBuffer<Type = any> extends IBuffer<Type> {
	freeze: () => this
	readonly isFrozen: boolean
}

export interface IUnfreezableBuffer<Type = any> extends IFreezableBuffer<Type> {
	unfreeze: () => this
	isFrozen: boolean
}

export interface IBufferized<Type = any> {
	buffer: IFreezableBuffer<Type>
}
