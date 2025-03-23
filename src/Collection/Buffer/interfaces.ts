import type { ISizeable } from "../../interfaces.js"
import type { ICollection } from "../interfaces.js"

export interface IFreezableBuffer<Type = any>
	extends ICollection<Type>,
		ISizeable {
	emptied: () => typeof this
	freeze: () => this
	read: (i: number) => Type
	readonly isFrozen: boolean
}

export interface IUnfreezableBuffer<Type = any> extends IFreezableBuffer<Type> {
	unfreeze: () => this
	isFrozen: boolean
}

export interface IBufferized<Type = any> {
	buffer: IFreezableBuffer<Type>
}
