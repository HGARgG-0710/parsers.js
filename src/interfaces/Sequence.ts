import type { ICollection } from "../interfaces.js"

export interface ISequence<Type = any>
	extends ICollection<Type>,
		Iterable<Type> {
	write: (i: number, value: Type) => this
	emptied: () => this
	read: (i: number) => Type
}

export interface IDynamicSequence<Type = any> extends ISequence<Type> {
	insert: (i: number, ...values: Type[]) => this
	remove: (i: number, count?: number) => this
	truncate: (from: number, to?: number) => this
}
