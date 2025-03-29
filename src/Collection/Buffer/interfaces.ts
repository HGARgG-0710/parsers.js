import type { ICollection } from "../interfaces.js"

export interface IFreezableBuffer<Type = any>
	extends ICollection<Type> {
	emptied: () => typeof this
	freeze: () => this
	read: (i: number) => Type
	
	readonly isFrozen: boolean
	readonly size: number; 
}

export interface IUnfreezableBuffer<Type = any> extends IFreezableBuffer<Type> {
	unfreeze: () => this
	isFrozen: boolean
}

export interface IBufferized<Type = any> {
	buffer: IFreezableBuffer<Type>
}
