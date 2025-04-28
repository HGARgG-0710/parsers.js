import type { ICollection, IReadable } from "../interfaces.js"

export interface IDynamicSequence<Type = any>
	extends ICollection<Type>,
		Iterable<Type>,
		IReadable<Type> {
	insert: (i: number, ...values: Type[]) => this
	remove: (i: number, count?: number) => this
	truncate: (from: number, to?: number) => this
	emptied: () => this
}
